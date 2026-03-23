import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Opportunity } from './opportunity.entity';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { SearchOpportunityDto } from './dto/search-opportunity.dto';
import { CRM_EVENTS, EventSource, EntityType } from '../events/event-types';
import { LeadsService } from '../leads/leads.service';
import { paginated } from '../common/dto/api-response';

@Injectable()
export class OpportunitiesService {
  constructor(
    @InjectRepository(Opportunity)
    private readonly oppRepo: Repository<Opportunity>,
    private readonly eventEmitter: EventEmitter2,
    private readonly leadsService: LeadsService,
  ) {}

  async search(dto: SearchOpportunityDto) {
    const { stage, minValue, maxValue, page = 1, limit = 20 } = dto;
    const qb = this.oppRepo.createQueryBuilder('opportunity');

    qb.leftJoinAndSelect('opportunity.lead', 'lead');

    if (stage) {
      qb.andWhere('opportunity.stage = :stage', { stage });
    }
    if (minValue !== undefined) {
      qb.andWhere('opportunity.value >= :minValue', { minValue });
    }
    if (maxValue !== undefined) {
      qb.andWhere('opportunity.value <= :maxValue', { maxValue });
    }

    qb.orderBy('opportunity.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return paginated(data, total, page, limit);
  }

  async findById(id: string): Promise<Opportunity> {
    const opportunity = await this.oppRepo.findOne({
      where: { id },
      relations: ['lead', 'activities'],
    });
    if (!opportunity) throw new NotFoundException(`Opportunity ${id} not found`);
    return opportunity;
  }

  async create(dto: CreateOpportunityDto, source = EventSource.USER): Promise<Opportunity> {
    await this.leadsService.findById(dto.leadId);
    const opportunity = this.oppRepo.create(dto);
    const saved = await this.oppRepo.save(opportunity);
    this.eventEmitter.emit(CRM_EVENTS.OPPORTUNITY_CREATED, {
      eventType: CRM_EVENTS.OPPORTUNITY_CREATED,
      source,
      entityType: EntityType.OPPORTUNITY,
      entityId: saved.id,
      payload: { opportunity: saved },
    });
    return saved;
  }

  async update(id: string, dto: UpdateOpportunityDto, source = EventSource.USER): Promise<Opportunity> {
    const opportunity = await this.findById(id);
    Object.assign(opportunity, dto);
    const saved = await this.oppRepo.save(opportunity);
    this.eventEmitter.emit(CRM_EVENTS.OPPORTUNITY_UPDATED, {
      eventType: CRM_EVENTS.OPPORTUNITY_UPDATED,
      source,
      entityType: EntityType.OPPORTUNITY,
      entityId: saved.id,
      payload: { opportunity: saved },
    });
    return saved;
  }

  async updateStage(id: string, stage: string, source = EventSource.USER): Promise<Opportunity> {
    const opportunity = await this.findById(id);
    const from = opportunity.stage;
    opportunity.stage = stage as any;
    const saved = await this.oppRepo.save(opportunity);
    this.eventEmitter.emit(CRM_EVENTS.OPPORTUNITY_STAGE_CHANGED, {
      eventType: CRM_EVENTS.OPPORTUNITY_STAGE_CHANGED,
      source,
      entityType: EntityType.OPPORTUNITY,
      entityId: saved.id,
      payload: { opportunity: saved, from, to: stage },
    });
    return saved;
  }

  async delete(id: string, source = EventSource.USER): Promise<void> {
    const opportunity = await this.findById(id);
    await this.oppRepo.remove(opportunity);
    this.eventEmitter.emit(CRM_EVENTS.OPPORTUNITY_DELETED, {
      eventType: CRM_EVENTS.OPPORTUNITY_DELETED,
      source,
      entityType: EntityType.OPPORTUNITY,
      entityId: id,
      payload: { id },
    });
  }
}
