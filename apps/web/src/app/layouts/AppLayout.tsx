import { useCallback, useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { ProLayout } from '@ant-design/pro-components';
import {
  DashboardOutlined,
  UserOutlined,
  FunnelPlotOutlined,
  HistoryOutlined,
  RobotOutlined,
} from '@ant-design/icons';

const menuRoutes = {
  routes: [
    { path: '/dashboard', name: 'Dashboard', icon: <DashboardOutlined /> },
    { path: '/leads', name: 'Leads', icon: <UserOutlined /> },
    { path: '/opportunities', name: 'Opportunities', icon: <FunnelPlotOutlined /> },
    { path: '/activities', name: 'Activities', icon: <HistoryOutlined /> },
    { path: '/agent', name: 'AI Agent', icon: <RobotOutlined /> },
  ],
};

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const loc = useMemo(() => ({ pathname: location.pathname }), [location.pathname]);

  const menuItemRender = useCallback(
    (item: any, dom: React.ReactNode) => (
      <div onClick={() => item.path && navigate(item.path)}>{dom}</div>
    ),
    [navigate],
  );

  return (
    <ProLayout
      title="TaxPod CRM"
      logo={null}
      route={menuRoutes}
      location={loc}
      menuItemRender={menuItemRender}
      layout="mix"
      fixSiderbar
      contentStyle={{ padding: 24 }}
    >
      <div style={{ animation: 'fadeIn 0.15s ease-in' }}>
        <Outlet />
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </ProLayout>
  );
}
