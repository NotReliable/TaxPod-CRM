import { tool } from 'ai';
import { z } from 'zod';

export function createCreateLeadTool() {
  return tool({
    description: 'Create a new lead in the CRM. This requires user confirmation before execution.',
    inputSchema: z.object({
      name: z.string().describe('Full name of the lead'),
      email: z.string().email().describe('Email address'),
      phone: z.string().optional().describe('Phone number'),
      company: z.string().optional().describe('Company name'),
      status: z.enum(['Lead', 'Prospect', 'Customer']).optional().describe('Lead status, defaults to Lead'),
    }),
    // No execute — requires client-side confirmation
  });
}
