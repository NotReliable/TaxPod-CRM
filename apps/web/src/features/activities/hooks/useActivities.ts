import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import type { ActivityLog, ActivityType } from '@/shared/types/models';
import type { PaginatedResponse } from '@/shared/types/api';

interface UseActivitiesParams {
  type?: ActivityType;
  leadId?: string;
  opportunityId?: string;
  page?: number;
  limit?: number;
}

export function useActivities(params: UseActivitiesParams = {}) {
  const { type, leadId, opportunityId, page = 1, limit = 20 } = params;
  return useQuery({
    queryKey: ['activities', type, leadId, opportunityId, page, limit],
    queryFn: () =>
      api.get<never, PaginatedResponse<ActivityLog>>('/activities', { params }),
  });
}
