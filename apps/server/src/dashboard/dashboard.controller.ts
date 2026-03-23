import { Controller, Get, Sse } from '@nestjs/common';
import { Observable, interval, switchMap, map } from 'rxjs';
import { DashboardService } from './dashboard.service';
import { EventLogService } from '../events/event-log.service';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly eventLogService: EventLogService,
  ) {}

  @Get('stats')
  getStats() {
    return this.dashboardService.getStats();
  }

  @Sse('activity-feed')
  activityFeed(): Observable<MessageEvent> {
    return interval(3000).pipe(
      switchMap(() => this.eventLogService.getRecentEvents(20)),
      map(
        (events) =>
          ({ data: JSON.stringify(events) }) as MessageEvent,
      ),
    );
  }
}
