import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import type { Opportunity, OpportunityStage } from '@/shared/types/models';
import type { PaginatedResponse } from '@/shared/types/api';

export function useOpportunities() {
  return useQuery({
    queryKey: ['opportunities'],
    queryFn: () =>
      api.get<never, PaginatedResponse<Opportunity>>('/opportunities', {
        params: { limit: 100 },
      }),
    select: (response) => {
      const opportunities = response.data;
      const stages: OpportunityStage[] = [
        'New',
        'Contacted',
        'Qualified',
        'Proposal',
        'Won',
        'Lost',
      ];

      const grouped = stages.reduce(
        (acc, stage) => {
          acc[stage] = opportunities.filter((o) => o.stage === stage);
          return acc;
        },
        {} as Record<OpportunityStage, Opportunity[]>,
      );

      return { opportunities, grouped };
    },
  });
}
