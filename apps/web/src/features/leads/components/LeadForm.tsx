import { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import type { Lead } from '@/shared/types/models';

interface LeadFormValues {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: LeadFormValues) => void;
  initialValues?: Lead;
  loading?: boolean;
}

export function LeadForm({ open, onClose, onSubmit, initialValues, loading }: Props) {
  const [form] = Form.useForm<LeadFormValues>();

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue({
          name: initialValues.name,
          email: initialValues.email,
          phone: initialValues.phone ?? undefined,
          company: initialValues.company ?? undefined,
          status: initialValues.status,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, initialValues, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    onSubmit(values);
  };

  return (
    <Modal
      title={initialValues ? 'Edit Lead' : 'Add Lead'}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={loading}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" initialValues={{ status: 'Lead' }}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter a name' }]}
        >
          <Input placeholder="Full name" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter an email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input placeholder="email@example.com" />
        </Form.Item>
        <Form.Item name="phone" label="Phone">
          <Input placeholder="Phone number" />
        </Form.Item>
        <Form.Item name="company" label="Company">
          <Input placeholder="Company name" />
        </Form.Item>
        <Form.Item name="status" label="Status">
          <Select>
            <Select.Option value="Lead">Lead</Select.Option>
            <Select.Option value="Prospect">Prospect</Select.Option>
            <Select.Option value="Customer">Customer</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
