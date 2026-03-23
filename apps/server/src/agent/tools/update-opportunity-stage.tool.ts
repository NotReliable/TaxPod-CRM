import { tool } from 'ai';
import { z } from 'zod';

export function createUpdateOpportunityStageTool() {
  return tool({
    description: 'Update the stage of an existing opportunity. This requires user confirmation before execution.',
    parameters: z.object({
      id: z.string().uuid().describe('The UUID of the opportunity to update'),
      stage: z.enum(['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost']).describe('The new stage for the opportunity'),
    }),
    // No execute — requires client-side confirmation
  });
}
