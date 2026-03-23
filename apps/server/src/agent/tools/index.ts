import { LeadsService } from '../../leads/leads.service';
import { OpportunitiesService } from '../../opportunities/opportunities.service';
import { createSearchLeadsTool } from './search-leads.tool';
import { createGetLeadDetailsTool } from './get-lead-details.tool';
import { createCreateLeadTool } from './create-lead.tool';
import { createUpdateLeadTool } from './update-lead.tool';
import { createSearchOpportunitiesTool } from './search-opportunities.tool';
import { createCreateOpportunityTool } from './create-opportunity.tool';
import { createUpdateOpportunityStageTool } from './update-opportunity-stage.tool';
import { createLogActivityTool } from './log-activity.tool';

export function createAgentTools(
  leadsService: LeadsService,
  opportunitiesService: OpportunitiesService,
) {
  return {
    search_leads: createSearchLeadsTool(leadsService),
    get_lead_details: createGetLeadDetailsTool(leadsService),
    create_lead: createCreateLeadTool(),
    update_lead: createUpdateLeadTool(),
    search_opportunities: createSearchOpportunitiesTool(opportunitiesService),
    create_opportunity: createCreateOpportunityTool(),
    update_opportunity_stage: createUpdateOpportunityStageTool(),
    log_activity: createLogActivityTool(),
  };
}
