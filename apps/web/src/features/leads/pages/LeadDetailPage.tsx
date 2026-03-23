import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Button, Descriptions, Spin, Tabs, Table, Timeline, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { api } from '@/shared/api/client';
import { PageHeader } from '@/shared/components/PageHeader';
import { EmptyState } from '@/shared/components/EmptyState';
import { LeadStatusTag } from '../components/LeadStatusTag';
import type { Lead, Opportunity, ActivityLog } from '@/shared/types/models';

function formatRM(value: number) {
  return `RM ${value.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function Component() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['leads', id],
    queryFn: () =>
      api.get<never, { data: Lead }>(`/leads/${id}`, {
        params: { include: 'opportunities,activities' },
      }),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
        <Spin size="large" />
      </div>
    );
  }

  const lead = data?.data;

  if (!lead) {
    return <EmptyState description="Lead not found" />;
  }

  const opportunities = lead.opportunities ?? [];
  const activities = lead.activities ?? [];

  return (
    <>
      <PageHeader
        title={lead.name}
        extra={
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/leads')}>
            Back to Leads
          </Button>
        }
      />

      <Descriptions bordered column={2} style={{ marginBottom: 24 }}>
        <Descriptions.Item label="Name">{lead.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{lead.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{lead.phone || '-'}</Descriptions.Item>
        <Descriptions.Item label="Company">{lead.company || '-'}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <LeadStatusTag status={lead.status} />
        </Descriptions.Item>
        <Descriptions.Item label="Created">
          {dayjs(lead.createdAt).format('DD MMM YYYY')}
        </Descriptions.Item>
      </Descriptions>

      <Tabs
        items={[
          {
            key: 'opportunities',
            label: `Opportunities (${opportunities.length})`,
            children:
              opportunities.length === 0 ? (
                <EmptyState description="No opportunities yet" />
              ) : (
                <Table<Opportunity>
                  dataSource={opportunities}
                  rowKey="id"
                  pagination={false}
                  columns={[
                    { title: 'Title', dataIndex: 'title', key: 'title' },
                    {
                      title: 'Stage',
                      dataIndex: 'stage',
                      key: 'stage',
                    },
                    {
                      title: 'Value',
                      dataIndex: 'value',
                      key: 'value',
                      render: (value: number) => formatRM(value),
                    },
                    {
                      title: 'Created',
                      dataIndex: 'createdAt',
                      key: 'createdAt',
                      render: (value: string) => dayjs(value).format('DD MMM YYYY'),
                    },
                  ]}
                />
              ),
          },
          {
            key: 'activities',
            label: `Activities (${activities.length})`,
            children:
              activities.length === 0 ? (
                <EmptyState description="No activities yet" />
              ) : (
                <Timeline
                  items={activities.map((activity: ActivityLog) => ({
                    children: (
                      <div>
                        <Typography.Text strong>
                          [{activity.type}] {dayjs(activity.date).format('DD MMM YYYY')}
                        </Typography.Text>
                        <br />
                        <Typography.Text>{activity.description}</Typography.Text>
                      </div>
                    ),
                  }))}
                />
              ),
          },
        ]}
      />
    </>
  );
}
