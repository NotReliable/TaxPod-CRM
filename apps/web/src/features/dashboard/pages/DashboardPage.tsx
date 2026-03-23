import { Row, Col } from 'antd';
import { PageHeader } from '@/shared/components/PageHeader';
import { StatsCards } from '../components/StatsCards';
import { OpportunityChart } from '../components/OpportunityChart';
import { ActivityFeed } from '../components/ActivityFeed';

export function Component() {
  return (
    <>
      <PageHeader title="Dashboard" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <StatsCards />
        <Row gutter={24}>
          <Col xs={24} lg={16}>
            <OpportunityChart />
          </Col>
          <Col xs={24} lg={8}>
            <ActivityFeed />
          </Col>
        </Row>
      </div>
    </>
  );
}
