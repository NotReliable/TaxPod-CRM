import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';
import type { OpportunityStage } from '@/shared/types/models';
import { useLeads } from '@/features/leads/hooks/useLeads';

interface OpportunityFormValues {
  title: string;
  value: number;
  leadId: string;
  stage?: OpportunityStage;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: OpportunityFormValues) => void;
  loading?: boolean;
}

const STAGES: OpportunityStage[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];

export function OpportunityForm({ open, onClose, onSubmit, loading }: Props) {
  const [form] = Form.useForm<OpportunityFormValues>();
  const { data: leadsData, isLoading: leadsLoading } = useLeads({ limit: 200 });

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    onSubmit(values);
  };

  const leadOptions = (leadsData?.data ?? []).map((lead) => ({
    label: lead.name,
    value: lead.id,
  }));

  return (
    <Modal
      title="Add Opportunity"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={{ stage: 'New' }}>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please enter a title' }]}
        >
          <Input placeholder="Opportunity title" />
        </Form.Item>
        <Form.Item
          name="value"
          label="Value (RM)"
          rules={[{ required: true, message: 'Please enter a value' }]}
        >
          <InputNumber
            placeholder="0.00"
            min={0}
            precision={2}
            style={{ width: '100%' }}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
        </Form.Item>
        <Form.Item
          name="leadId"
          label="Lead"
          rules={[{ required: true, message: 'Please select a lead' }]}
        >
          <Select
            placeholder="Select a lead"
            showSearch
            optionFilterProp="label"
            loading={leadsLoading}
            options={leadOptions}
          />
        </Form.Item>
        <Form.Item name="stage" label="Stage">
          <Select>
            {STAGES.map((stage) => (
              <Select.Option key={stage} value={stage}>
                {stage}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
