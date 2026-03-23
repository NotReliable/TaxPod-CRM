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
  return useQuery({
    queryKey: ['activities', params],
    queryFn: () =>
      api.get<never, PaginatedResponse<ActivityLog>>('/activities', { params }),
  });
}
