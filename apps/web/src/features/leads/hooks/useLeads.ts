import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import type { Lead, LeadStatus } from '@/shared/types/models';
import type { PaginatedResponse } from '@/shared/types/api';

interface UseLeadsParams {
  query?: string;
  status?: LeadStatus;
  page?: number;
  limit?: number;
}

export function useLeads(params: UseLeadsParams = {}) {
  return useQuery({
    queryKey: ['leads', params],
    queryFn: () =>
      api.get<never, PaginatedResponse<Lead>>('/leads', { params }),
  });
}
