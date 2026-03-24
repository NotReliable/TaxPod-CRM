import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import type { DashboardStats } from '@/shared/types/models';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => api.get<never, DashboardStats>('/dashboard/stats'),
    refetchInterval: 30_000,
  });
}
