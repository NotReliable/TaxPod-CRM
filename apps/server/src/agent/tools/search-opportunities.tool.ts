import { tool } from 'ai';
import { z } from 'zod';
import { OpportunitiesService } from '../../opportunities/opportunities.service';

export function createSearchOpportunitiesTool(opportunitiesService: OpportunitiesService) {
  return tool({
    description: 'Search opportunities by stage, value range. Returns matching opportunities with pagination.',
    parameters: z.object({
      stage: z.enum(['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost']).optional().describe('Filter by opportunity stage'),
      minValue: z.number().optional().describe('Minimum opportunity value in RM'),
      maxValue: z.number().optional().describe('Maximum opportunity value in RM'),
    }),
    execute: async (params) => {
      const result = await opportunitiesService.search({
        stage: params.stage as any,
        minValue: params.minValue,
        maxValue: params.maxValue,
        limit: 20,
      });
      return result;
    },
  });
}
