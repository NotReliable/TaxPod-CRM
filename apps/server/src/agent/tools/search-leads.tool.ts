import { tool } from 'ai';
import { z } from 'zod';
import { LeadsService } from '../../leads/leads.service';

export function createSearchLeadsTool(leadsService: LeadsService) {
  return tool({
    description: 'Search leads by name, email, company, or status. Returns matching leads with pagination.',
    parameters: z.object({
      query: z.string().optional().describe('Search text to match against name, email, or company'),
      status: z.enum(['Lead', 'Prospect', 'Customer']).optional().describe('Filter by lead status'),
    }),
    execute: async (params) => {
      const result = await leadsService.search({ query: params.query, status: params.status as any, limit: 20 });
      return result;
    },
  });
}
