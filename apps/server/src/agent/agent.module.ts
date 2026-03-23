import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentConversation } from './entities/agent-conversation.entity';
import { AgentMessage } from './entities/agent-message.entity';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { LeadsModule } from '../leads/leads.module';
import { OpportunitiesModule } from '../opportunities/opportunities.module';
import { ActivitiesModule } from '../activities/activities.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AgentConversation, AgentMessage]),
    LeadsModule, OpportunitiesModule, ActivitiesModule,
  ],
  controllers: [AgentController],
  providers: [AgentService],
})
export class AgentModule {}
