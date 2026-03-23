import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import type { Opportunity, OpportunityStage } from '@/shared/types/models';

interface CreateOpportunityInput {
  title: string;
  value: number;
  leadId: string;
  stage?: OpportunityStage;
}

export function useCreateOpportunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateOpportunityInput) =>
      api.post<never, { data: Opportunity }>('/opportunities', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
