import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import type { ActivityLog, ActivityType } from '@/shared/types/models';

interface CreateActivityInput {
  type: ActivityType;
  description: string;
  date: string;
  leadId?: string;
  opportunityId?: string;
}

export function useCreateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateActivityInput) =>
      api.post<never, { data: ActivityLog }>('/activities', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
