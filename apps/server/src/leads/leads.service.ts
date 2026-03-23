import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Lead } from './lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { SearchLeadDto } from './dto/search-lead.dto';
import { CRM_EVENTS, EventSource, EntityType } from '../events/event-types';
import { paginated } from '../common/dto/api-response';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepo: Repository<Lead>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async search(dto: SearchLeadDto) {
    const { query, status, page = 1, limit = 20 } = dto;
    const qb = this.leadRepo.createQueryBuilder('lead');

    if (query) {
      qb.andWhere(
        '(lead.name ILIKE :q OR lead.email ILIKE :q OR lead.company ILIKE :q)',
        { q: `%${query}%` },
      );
    }
    if (status) {
      qb.andWhere('lead.status = :status', { status });
    }

    qb.orderBy('lead.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return paginated(data, total, page, limit);
  }

  async findById(id: string): Promise<Lead> {
    const lead = await this.leadRepo.findOne({
      where: { id },
      relations: ['opportunities', 'activities'],
    });
    if (!lead) throw new NotFoundException(`Lead ${id} not found`);
    return lead;
  }

  async create(dto: CreateLeadDto, source = EventSource.USER): Promise<Lead> {
    const lead = this.leadRepo.create(dto);
    const saved = await this.leadRepo.save(lead);
    this.eventEmitter.emit(CRM_EVENTS.LEAD_CREATED, {
      eventType: CRM_EVENTS.LEAD_CREATED,
      source,
      entityType: EntityType.LEAD,
      entityId: saved.id,
      payload: { lead: saved },
    });
    return saved;
  }

  async update(id: string, dto: UpdateLeadDto, source = EventSource.USER): Promise<Lead> {
    const lead = await this.findById(id);
    Object.assign(lead, dto);
    const saved = await this.leadRepo.save(lead);
    this.eventEmitter.emit(CRM_EVENTS.LEAD_UPDATED, {
      eventType: CRM_EVENTS.LEAD_UPDATED,
      source,
      entityType: EntityType.LEAD,
      entityId: saved.id,
      payload: { lead: saved },
    });
    return saved;
  }

  async delete(id: string, source = EventSource.USER): Promise<void> {
    const lead = await this.findById(id);
    await this.leadRepo.remove(lead);
    this.eventEmitter.emit(CRM_EVENTS.LEAD_DELETED, {
      eventType: CRM_EVENTS.LEAD_DELETED,
      source,
      entityType: EntityType.LEAD,
      entityId: id,
      payload: { id },
    });
  }
}
