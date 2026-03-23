import { Typography } from 'antd';
import { useDroppable } from '@dnd-kit/core';
import type { Opportunity, OpportunityStage } from '@/shared/types/models';
import { OpportunityCard } from './OpportunityCard';

const rmFormatter = new Intl.NumberFormat('en-MY', {
  style: 'currency',
  currency: 'MYR',
  minimumFractionDigits: 2,
});

interface Props {
  stage: OpportunityStage;
  opportunities: Opportunity[];
}

export function KanbanColumn({ stage, opportunities }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });

  const totalValue = opportunities.reduce((sum, o) => sum + o.value, 0);

  return (
    <div
      ref={setNodeRef}
      style={{
        minWidth: 250,
        flex: '1 0 250px',
        backgroundColor: isOver ? '#e6f4ff' : '#f5f5f5',
        borderRadius: 8,
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        transition: 'background-color 0.2s',
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography.Text strong>{stage}</Typography.Text>
          <Typography.Text type="secondary">{opportunities.length}</Typography.Text>
        </div>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {rmFormatter.format(totalValue)}
        </Typography.Text>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {opportunities.map((opportunity) => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} />
        ))}
      </div>
    </div>
  );
}
