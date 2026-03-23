import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { Spin } from 'antd';
import type { OpportunityStage } from '@/shared/types/models';
import { useOpportunities } from '../hooks/useOpportunities';
import { useUpdateStage } from '../hooks/useUpdateStage';
import { KanbanColumn } from './KanbanColumn';

const STAGES: OpportunityStage[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];

export function KanbanBoard() {
  const { data, isLoading } = useOpportunities();
  const updateStage = useUpdateStage();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const opportunityId = active.id as string;
    const newStage = over.id as OpportunityStage;

    const currentOpportunity = data?.opportunities.find((o) => o.id === opportunityId);
    if (!currentOpportunity || currentOpportunity.stage === newStage) return;

    updateStage.mutate({ id: opportunityId, stage: newStage });
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
        <Spin size="large" />
      </div>
    );
  }

  const grouped = data?.grouped ?? ({} as Record<OpportunityStage, []>);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div
        style={{
          display: 'flex',
          gap: 12,
          overflowX: 'auto',
          paddingBottom: 16,
          minHeight: 400,
        }}
      >
        {STAGES.map((stage) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            opportunities={grouped[stage] ?? []}
          />
        ))}
      </div>
    </DndContext>
  );
}
