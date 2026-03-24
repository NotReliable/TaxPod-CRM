import { createBrowserRouter, Navigate } from 'react-router';
import { Spin } from 'antd';
import { AppLayout } from './layouts/AppLayout';

function PageLoader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
      <Spin size="large" />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    HydrateFallback: PageLoader,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: 'dashboard',
        lazy: () => import('@/features/dashboard/pages/DashboardPage'),
        HydrateFallback: PageLoader,
      },
      {
        path: 'leads',
        lazy: () => import('@/features/leads/pages/LeadsPage'),
        HydrateFallback: PageLoader,
      },
      {
        path: 'leads/:id',
        lazy: () => import('@/features/leads/pages/LeadDetailPage'),
        HydrateFallback: PageLoader,
      },
      {
        path: 'opportunities',
        lazy: () => import('@/features/opportunities/pages/OpportunitiesPage'),
        HydrateFallback: PageLoader,
      },
      {
        path: 'activities',
        lazy: () => import('@/features/activities/pages/ActivitiesPage'),
        HydrateFallback: PageLoader,
      },
      {
        path: 'agent',
        lazy: () => import('@/features/agent/pages/AgentPage'),
        HydrateFallback: PageLoader,
      },
    ],
  },
]);
