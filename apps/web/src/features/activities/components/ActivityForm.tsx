import { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import dayjs from '@/shared/utils/dayjs';
import type { ActivityType } from '@/shared/types/models';
import { useLeads } from '@/features/leads/hooks/useLeads';
import { useOpportunities } from '@/features/opportunities/hooks/useOpportunities';

interface ActivityFormValues {
  type: ActivityType;
  description: string;
  date: dayjs.Dayjs;
  leadId?: string;
  opportunityId?: string;
}

interface SubmitValues {
  type: ActivityType;
  description: string;
  date: string;
  leadId?: string;
  opportunityId?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: SubmitValues) => void;
  loading?: boolean;
}

const ACTIVITY_TYPES: ActivityType[] = ['Call', 'Email', 'Meeting', 'Note'];

export function ActivityForm({ open, onClose, onSubmit, loading }: Props) {
  const [form] = Form.useForm<ActivityFormValues>();
  const { data: leadsData, isLoading: leadsLoading } = useLeads({ limit: 100 });
  const { data: opportunitiesData, isLoading: opportunitiesLoading } = useOpportunities();

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    onSubmit({
      ...values,
      date: values.date.toISOString(),
    });
  };

  const leadOptions = (leadsData?.data ?? []).map((lead) => ({
    label: lead.name,
    value: lead.id,
  }));

  const opportunityOptions = (opportunitiesData?.opportunities ?? []).map((opp) => ({
    label: opp.title,
    value: opp.id,
  }));

  return (
    <Modal
      title="Log Activity"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={loading}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" initialValues={{ date: dayjs() }}>
        <Form.Item
          name="type"
          label="Type"
          rules={[{ required: true, message: 'Please select an activity type' }]}
        >
          <Select placeholder="Select type">
            {ACTIVITY_TYPES.map((type) => (
              <Select.Option key={type} value={type}>
                {type}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: 'Please select a date' }]}
        >
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter a description' }]}
        >
          <Input.TextArea rows={3} placeholder="Activity description" />
        </Form.Item>
        <Form.Item name="leadId" label="Lead">
          <Select
            placeholder="Select a lead"
            showSearch
            optionFilterProp="label"
            allowClear
            loading={leadsLoading}
            options={leadOptions}
          />
        </Form.Item>
        <Form.Item name="opportunityId" label="Opportunity">
          <Select
            placeholder="Select an opportunity"
            showSearch
            optionFilterProp="label"
            allowClear
            loading={opportunitiesLoading}
            options={opportunityOptions}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
