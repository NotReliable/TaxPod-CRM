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
  const { query, status, page = 1, limit = 20 } = params;
  return useQuery({
    queryKey: ['leads', query, status, page, limit],
    queryFn: () =>
      api.get<never, PaginatedResponse<Lead>>('/leads', { params }),
  });
}
