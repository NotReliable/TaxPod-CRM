import { tool } from 'ai';
import { z } from 'zod';

export function createUpdateLeadTool() {
  return tool({
    description: 'Update an existing lead in the CRM. This requires user confirmation before execution.',
    inputSchema: z.object({
      id: z.string().uuid().describe('The UUID of the lead to update'),
      name: z.string().optional().describe('Full name of the lead'),
      email: z.string().email().optional().describe('Email address'),
      phone: z.string().optional().describe('Phone number'),
      company: z.string().optional().describe('Company name'),
      status: z.enum(['Lead', 'Prospect', 'Customer']).optional().describe('Lead status'),
    }),
    // No execute — requires client-side confirmation
  });
}
