import { Card, Typography } from 'antd';
import { useDraggable } from '@dnd-kit/core';
import type { Opportunity } from '@/shared/types/models';

const rmFormatter = new Intl.NumberFormat('en-MY', {
  style: 'currency',
  currency: 'MYR',
  minimumFractionDigits: 2,
});

interface Props {
  opportunity: Opportunity;
}

export function OpportunityCard({ opportunity }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: opportunity.id,
    data: { opportunity },
  });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    marginBottom: 8,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Card size="small" hoverable>
        <Typography.Text strong>{opportunity.title}</Typography.Text>
        <div style={{ marginTop: 4 }}>
          <Typography.Text type="success">
            {rmFormatter.format(opportunity.value)}
          </Typography.Text>
        </div>
        {opportunity.lead && (
          <div style={{ marginTop: 4 }}>
            <Typography.Text type="secondary">{opportunity.lead.name}</Typography.Text>
          </div>
        )}
      </Card>
    </div>
  );
}
