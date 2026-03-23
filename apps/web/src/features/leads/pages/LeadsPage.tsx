import { useState, useCallback } from 'react';
import { Button, Input, Select, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageHeader } from '@/shared/components/PageHeader';
import { EmptyState } from '@/shared/components/EmptyState';
import { useLeads } from '../hooks/useLeads';
import { useCreateLead } from '../hooks/useCreateLead';
import { useUpdateLead } from '../hooks/useUpdateLead';
import { useDeleteLead } from '../hooks/useDeleteLead';
import { LeadTable } from '../components/LeadTable';
import { LeadForm } from '../components/LeadForm';
import type { Lead, LeadStatus } from '@/shared/types/models';

export function Component() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | undefined>();
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | undefined>();

  const { data, isLoading } = useLeads({
    query: search || undefined,
    status: statusFilter,
    page,
    limit: 10,
  });

  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();

  const handleOpenCreate = useCallback(() => {
    setEditingLead(undefined);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((lead: Lead) => {
    setEditingLead(lead);
    setModalOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setModalOpen(false);
    setEditingLead(undefined);
  }, []);

  const handleSubmit = useCallback(
    async (values: { name: string; email: string; phone?: string; company?: string; status?: string }) => {
      if (editingLead) {
        await updateLead.mutateAsync({ id: editingLead.id, ...values });
        message.success('Lead updated successfully');
      } else {
        await createLead.mutateAsync(values);
        message.success('Lead created successfully');
      }
      handleClose();
    },
    [editingLead, updateLead, createLead, handleClose],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteLead.mutateAsync(id);
      message.success('Lead deleted successfully');
    },
    [deleteLead],
  );

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const leads = data?.data ?? [];
  const meta = data?.meta;

  return (
    <>
      <PageHeader
        title="Leads"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreate}>
            Add Lead
          </Button>
        }
      />

      <Space style={{ marginBottom: 16 }} size="middle">
        <Input.Search
          placeholder="Search leads..."
          allowClear
          onSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
          style={{ width: 280 }}
        />
        <Select
          placeholder="Filter by status"
          allowClear
          onChange={(value: LeadStatus | undefined) => {
            setStatusFilter(value);
            setPage(1);
          }}
          style={{ width: 180 }}
          options={[
            { label: 'Lead', value: 'Lead' },
            { label: 'Prospect', value: 'Prospect' },
            { label: 'Customer', value: 'Customer' },
          ]}
        />
      </Space>

      {!isLoading && leads.length === 0 ? (
        <EmptyState description="No leads found">
          <Button type="primary" onClick={handleOpenCreate}>
            Create your first lead
          </Button>
        </EmptyState>
      ) : (
        <LeadTable
          leads={leads}
          loading={isLoading}
          pagination={
            meta
              ? { current: meta.page, pageSize: meta.limit, total: meta.total }
              : undefined
          }
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <LeadForm
        open={modalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initialValues={editingLead}
        loading={createLead.isPending || updateLead.isPending}
      />
    </>
  );
}
