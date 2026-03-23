import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import type { Opportunity, OpportunityStage } from '@/shared/types/models';
import type { PaginatedResponse } from '@/shared/types/api';

interface UpdateStageInput {
  id: string;
  stage: OpportunityStage;
}

export function useUpdateStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, stage }: UpdateStageInput) =>
      api.patch<never, { data: Opportunity }>(`/opportunities/${id}/stage`, { stage }),

    onMutate: async ({ id, stage }) => {
      await queryClient.cancelQueries({ queryKey: ['opportunities'] });

      const previous = queryClient.getQueryData<PaginatedResponse<Opportunity>>(['opportunities']);

      queryClient.setQueryData<PaginatedResponse<Opportunity>>(['opportunities'], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((o) => (o.id === id ? { ...o, stage } : o)),
        };
      });

      return { previous };
    },

    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['opportunities'], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
