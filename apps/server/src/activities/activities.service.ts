import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ActivityLog } from './activity-log.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { SearchActivityDto } from './dto/search-activity.dto';
import { CRM_EVENTS, EventSource, EntityType } from '../events/event-types';
import { paginated } from '../common/dto/api-response';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityRepo: Repository<ActivityLog>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async search(dto: SearchActivityDto) {
    const { type, leadId, opportunityId, page = 1, limit = 20 } = dto;
    const qb = this.activityRepo.createQueryBuilder('activity');

    qb.leftJoinAndSelect('activity.lead', 'lead');
    qb.leftJoinAndSelect('activity.opportunity', 'opportunity');

    if (type) {
      qb.andWhere('activity.type = :type', { type });
    }
    if (leadId) {
      qb.andWhere('activity.leadId = :leadId', { leadId });
    }
    if (opportunityId) {
      qb.andWhere('activity.opportunityId = :opportunityId', { opportunityId });
    }

    qb.orderBy('activity.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return paginated(data, total, page, limit);
  }

  async create(dto: CreateActivityDto, source = EventSource.USER): Promise<ActivityLog> {
    if (!dto.leadId && !dto.opportunityId) {
      throw new BadRequestException('At least one of leadId or opportunityId must be provided');
    }

    const activity = this.activityRepo.create(dto);
    const saved = await this.activityRepo.save(activity);
    this.eventEmitter.emit(CRM_EVENTS.ACTIVITY_CREATED, {
      eventType: CRM_EVENTS.ACTIVITY_CREATED,
      source,
      entityType: EntityType.ACTIVITY,
      entityId: saved.id,
      payload: { activity: saved },
    });
    return saved;
  }

  async delete(id: string, source = EventSource.USER): Promise<void> {
    const activity = await this.activityRepo.findOne({ where: { id } });
    if (!activity) throw new NotFoundException(`Activity ${id} not found`);
    await this.activityRepo.remove(activity);
    this.eventEmitter.emit(CRM_EVENTS.ACTIVITY_DELETED, {
      eventType: CRM_EVENTS.ACTIVITY_DELETED,
      source,
      entityType: EntityType.ACTIVITY,
      entityId: id,
      payload: { id },
    });
  }
}
