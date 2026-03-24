import { useState, useCallback } from 'react';
import { Button, Select, Space, Pagination, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageHeader } from '@/shared/components/PageHeader';
import { EmptyState } from '@/shared/components/EmptyState';
import { useActivities } from '../hooks/useActivities';
import { useCreateActivity } from '../hooks/useCreateActivity';
import { ActivityTimeline } from '../components/ActivityTimeline';
import { ActivityForm } from '../components/ActivityForm';
import { useLeads } from '@/features/leads/hooks/useLeads';
import type { ActivityType } from '@/shared/types/models';
import { message } from 'antd';

export function Component() {
  const [typeFilter, setTypeFilter] = useState<ActivityType | undefined>();
  const [leadFilter, setLeadFilter] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading } = useActivities({
    type: typeFilter,
    leadId: leadFilter,
    page,
    limit: 10,
  });

  const { data: leadsData } = useLeads({ limit: 100 });
  const createActivity = useCreateActivity();

  const handleOpen = useCallback(() => setModalOpen(true), []);
  const handleClose = useCallback(() => setModalOpen(false), []);

  const handleSubmit = useCallback(
    async (values: {
      type: ActivityType;
      description: string;
      date: string;
      leadId?: string;
      opportunityId?: string;
    }) => {
      await createActivity.mutateAsync(values);
      message.success('Activity logged successfully');
      handleClose();
    },
    [createActivity, handleClose],
  );

  const activities = data?.data ?? [];
  const meta = data?.meta;

  const leadOptions = (leadsData?.data ?? []).map((lead) => ({
    label: lead.name,
    value: lead.id,
  }));

  return (
    <>
      <PageHeader
        title="Activities"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpen}>
            Log Activity
          </Button>
        }
      />

      <Space style={{ marginBottom: 16 }} size="middle">
        <Select
          placeholder="Filter by type"
          allowClear
          onChange={(value: ActivityType | undefined) => {
            setTypeFilter(value);
            setPage(1);
          }}
          style={{ width: 180 }}
          options={[
            { label: 'Call', value: 'Call' },
            { label: 'Email', value: 'Email' },
            { label: 'Meeting', value: 'Meeting' },
            { label: 'Note', value: 'Note' },
          ]}
        />
        <Select
          placeholder="Filter by lead"
          allowClear
          showSearch
          optionFilterProp="label"
          onChange={(value: string | undefined) => {
            setLeadFilter(value);
            setPage(1);
          }}
          style={{ width: 220 }}
          options={leadOptions}
        />
      </Space>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
          <Spin size="large" />
        </div>
      ) : activities.length === 0 ? (
        <EmptyState description="No activities found">
          <Button type="primary" onClick={handleOpen}>
            Log your first activity
          </Button>
        </EmptyState>
      ) : (
        <>
          <ActivityTimeline activities={activities} />
          {meta && meta.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
              <Pagination
                current={meta.page}
                pageSize={meta.limit}
                total={meta.total}
                onChange={(newPage) => setPage(newPage)}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}

      <ActivityForm
        open={modalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        loading={createActivity.isPending}
      />
    </>
  );
}
