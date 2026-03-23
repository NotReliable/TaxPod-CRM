import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from '../leads/lead.entity';
import { Opportunity } from '../opportunities/opportunity.entity';
import { OpportunityStage } from '../opportunities/opportunity-stage.enum';
import { EventLogService } from '../events/event-log.service';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepo: Repository<Lead>,
    @InjectRepository(Opportunity)
    private readonly opportunityRepo: Repository<Opportunity>,
    private readonly eventLogService: EventLogService,
  ) {}

  async getStats() {
    const totalContacts = await this.leadRepo.count();

    const openOpportunities = await this.opportunityRepo.count({
      where: [
        { stage: OpportunityStage.NEW },
        { stage: OpportunityStage.CONTACTED },
        { stage: OpportunityStage.QUALIFIED },
        { stage: OpportunityStage.PROPOSAL },
      ],
    });

    const totalValueResult = await this.opportunityRepo
      .createQueryBuilder('opp')
      .select('SUM(opp.value)', 'total')
      .getRawOne();
    const totalOpportunitiesValue = Number(totalValueResult?.total || 0);

    const recentActivity = await this.eventLogService.getRecentEvents(10);

    return {
      totalContacts,
      openOpportunities,
      totalOpportunitiesValue,
      recentActivity,
    };
  }
}
