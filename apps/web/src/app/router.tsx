import { createBrowserRouter, Navigate } from 'react-router';
import { AppLayout } from './layouts/AppLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: 'dashboard',
        lazy: () => import('@/features/dashboard/pages/DashboardPage'),
      },
      {
        path: 'leads',
        lazy: () => import('@/features/leads/pages/LeadsPage'),
      },
      {
        path: 'leads/:id',
        lazy: () => import('@/features/leads/pages/LeadDetailPage'),
      },
      {
        path: 'opportunities',
        lazy: () => import('@/features/opportunities/pages/OpportunitiesPage'),
      },
      {
        path: 'activities',
        lazy: () => import('@/features/activities/pages/ActivitiesPage'),
      },
      {
        path: 'agent',
        lazy: () => import('@/features/agent/pages/AgentPage'),
      },
    ],
  },
]);
