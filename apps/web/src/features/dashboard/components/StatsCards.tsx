import { Row, Col, Card, Statistic, Spin } from 'antd';
import {
  UserOutlined,
  FunnelPlotOutlined,
  DollarOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useDashboardStats } from '../hooks/useDashboardStats';

const rmFormatter = new Intl.NumberFormat('en-MY', {
  style: 'currency',
  currency: 'MYR',
  minimumFractionDigits: 2,
});

export function StatsCards() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
        <Spin />
      </div>
    );
  }

  const stats = data as any;

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Total Contacts"
            value={stats?.totalContacts ?? 0}
            prefix={<UserOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Open Opportunities"
            value={stats?.openOpportunities ?? 0}
            prefix={<FunnelPlotOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Total Value"
            value={stats?.totalOpportunitiesValue ?? 0}
            prefix={<DollarOutlined />}
            formatter={(value) => rmFormatter.format(Number(value))}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Recent Activities"
            value={stats?.recentActivity?.length ?? 0}
            prefix={<ClockCircleOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
}
