import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import type { Lead } from '@/shared/types/models';

interface UpdateLeadInput {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: string;
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: UpdateLeadInput) =>
      api.patch<never, { data: Lead }>(`/leads/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
