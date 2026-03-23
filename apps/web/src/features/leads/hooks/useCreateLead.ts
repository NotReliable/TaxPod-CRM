import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import type { Lead } from '@/shared/types/models';

interface CreateLeadInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status?: string;
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateLeadInput) =>
      api.post<never, { data: Lead }>('/leads', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
