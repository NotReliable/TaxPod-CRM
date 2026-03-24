import { tool } from 'ai';
import { z } from 'zod';

export function createUpdateLeadTool() {
  return tool({
    description: `Update specific fields of an existing lead. IMPORTANT: Only pass the fields the user wants to change. Do NOT include fields that should stay the same. For example, if the user says "change Ahmad's name to John", only pass { id, name: "John" } — do NOT include email, phone, company, or status. Requires user confirmation.`,
    inputSchema: z.object({
      id: z.string().uuid().describe('The UUID of the lead to update'),
      name: z.string().optional().describe('Only if user wants to change the name'),
      email: z.string().email().optional().describe('Only if user wants to change the email'),
      phone: z.string().optional().describe('Only if user wants to change the phone'),
      company: z.string().optional().describe('Only if user wants to change the company'),
      status: z.enum(['Lead', 'Prospect', 'Customer']).optional().describe('Only if user wants to change the status'),
    }),
    // No execute — requires client-side confirmation
  });
}
