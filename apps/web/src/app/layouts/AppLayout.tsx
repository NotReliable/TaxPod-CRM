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

  return (
    <ProLayout
      title="TaxPod CRM"
      logo={null}
      route={menuRoutes}
      location={{ pathname: location.pathname }}
      menuItemRender={(item, dom) => (
        <div onClick={() => item.path && navigate(item.path)}>{dom}</div>
      )}
      layout="mix"
      fixSiderbar
      contentStyle={{ padding: 24 }}
    >
      <Outlet />
    </ProLayout>
  );
}
