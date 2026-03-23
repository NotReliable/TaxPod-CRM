import { tool } from 'ai';
import { z } from 'zod';

export function createLogActivityTool() {
  return tool({
    description: 'Log a new activity (call, email, meeting, or note) in the CRM. This requires user confirmation before execution.',
    parameters: z.object({
      type: z.enum(['Call', 'Email', 'Meeting', 'Note']).describe('Type of activity'),
      description: z.string().describe('Description of the activity'),
      date: z.string().optional().describe('Date of the activity in ISO format, defaults to now'),
      leadId: z.string().uuid().optional().describe('The UUID of the related lead'),
      opportunityId: z.string().uuid().optional().describe('The UUID of the related opportunity'),
    }),
    // No execute — requires client-side confirmation
  });
}
