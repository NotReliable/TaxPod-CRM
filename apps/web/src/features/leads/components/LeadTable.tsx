import { useMemo } from 'react';
import { Button, Popconfirm, Table } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router';
import dayjs from 'dayjs';
import type { Lead } from '@/shared/types/models';
import { LeadStatusTag } from './LeadStatusTag';

interface Props {
  leads: Lead[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
  };
  onPageChange?: (page: number, pageSize: number) => void;
  onEdit?: (lead: Lead) => void;
  onDelete?: (id: string) => void;
}

export function LeadTable({ leads, loading, pagination, onPageChange, onEdit, onDelete }: Props) {
  const columns = useMemo(() => [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Lead) => (
        <Link to={`/leads/${record.id}`}>{name}</Link>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (value: string | null) => value || '-',
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
      render: (value: string | null) => value || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Lead['status']) => <LeadStatusTag status={status} />,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: string) => dayjs(value).format('DD MMM YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Lead) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            type="link"
            icon={<EditOutlined />}
            size="small"
            onClick={() => onEdit?.(record)}
          />
          <Popconfirm
            title="Delete this lead?"
            description="This action cannot be undone."
            onConfirm={() => onDelete?.(record.id)}
            okText="Delete"
            okType="danger"
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </div>
      ),
    },
  ], [onEdit, onDelete]);

  return (
    <Table
      dataSource={leads}
      rowKey="id"
      loading={loading}
      pagination={
        pagination
          ? {
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: onPageChange,
              showSizeChanger: false,
            }
          : false
      }
      columns={columns}
    />
  );
}
