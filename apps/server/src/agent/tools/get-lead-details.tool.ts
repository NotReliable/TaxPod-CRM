import { tool } from 'ai';
import { z } from 'zod';
import { LeadsService } from '../../leads/leads.service';

export function createGetLeadDetailsTool(leadsService: LeadsService) {
  return tool({
    description: 'Get detailed information about a specific lead including their opportunities and activities.',
    inputSchema: z.object({
      id: z.string().uuid().describe('The UUID of the lead to retrieve'),
    }),
    execute: async (params) => {
      const lead = await leadsService.findById(params.id);
      return lead;
    },
  });
}
