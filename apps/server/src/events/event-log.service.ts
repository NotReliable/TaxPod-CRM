import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { EventLog } from './event-log.entity';
import { EventSource } from './event-types';

interface CrmEvent {
  eventType: string;
  source: EventSource;
  entityType?: string;
  entityId?: string;
  payload: Record<string, unknown>;
}

@Injectable()
export class EventLogService {
  constructor(
    @InjectRepository(EventLog)
    private readonly eventLogRepo: Repository<EventLog>,
  ) {}

  @OnEvent('**')
  async handleEvent(event: CrmEvent) {
    if (!event.eventType) return;
    const log = this.eventLogRepo.create({
      eventType: event.eventType,
      source: event.source,
      entityType: event.entityType ?? null,
      entityId: event.entityId ?? null,
      payload: event.payload,
    });
    await this.eventLogRepo.save(log);
  }

  async getRecentEvents(limit = 20): Promise<EventLog[]> {
    return this.eventLogRepo.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
