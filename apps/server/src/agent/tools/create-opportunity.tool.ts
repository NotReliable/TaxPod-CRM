import { tool } from 'ai';
import { z } from 'zod';

export function createCreateOpportunityTool() {
  return tool({
    description: 'Create a new opportunity in the CRM. This requires user confirmation before execution.',
    inputSchema: z.object({
      title: z.string().describe('Title of the opportunity'),
      value: z.number().describe('Value of the opportunity in RM (Malaysian Ringgit)'),
      leadId: z.string().uuid().describe('The UUID of the lead this opportunity belongs to'),
      stage: z.enum(['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost']).optional().describe('Opportunity stage, defaults to New'),
    }),
    // No execute — requires client-side confirmation
  });
}
