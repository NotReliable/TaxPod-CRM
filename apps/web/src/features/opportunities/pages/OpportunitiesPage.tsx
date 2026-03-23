import { useState, useCallback } from 'react';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageHeader } from '@/shared/components/PageHeader';
import { KanbanBoard } from '../components/KanbanBoard';
import { OpportunityForm } from '../components/OpportunityForm';
import { useCreateOpportunity } from '../hooks/useCreateOpportunity';
import type { OpportunityStage } from '@/shared/types/models';

export function Component() {
  const [modalOpen, setModalOpen] = useState(false);
  const createOpportunity = useCreateOpportunity();

  const handleOpen = useCallback(() => setModalOpen(true), []);
  const handleClose = useCallback(() => setModalOpen(false), []);

  const handleSubmit = useCallback(
    async (values: { title: string; value: number; leadId: string; stage?: OpportunityStage }) => {
      await createOpportunity.mutateAsync(values);
      message.success('Opportunity created successfully');
      handleClose();
    },
    [createOpportunity, handleClose],
  );

  return (
    <>
      <PageHeader
        title="Opportunities"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpen}>
            Add Opportunity
          </Button>
        }
      />
      <KanbanBoard />
      <OpportunityForm
        open={modalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        loading={createOpportunity.isPending}
      />
    </>
  );
}
