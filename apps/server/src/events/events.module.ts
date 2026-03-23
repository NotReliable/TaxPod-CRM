import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventLog } from './event-log.entity';
import { EventLogService } from './event-log.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([EventLog])],
  providers: [EventLogService],
  exports: [EventLogService],
})
export class EventsModule {}
