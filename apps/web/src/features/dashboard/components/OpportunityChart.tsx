import { Card, Spin } from 'antd';
import { Column } from '@ant-design/charts';
import { useOpportunities } from '@/features/opportunities/hooks/useOpportunities';
import type { OpportunityStage } from '@/shared/types/models';

const STAGES: OpportunityStage[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];

const rmFormatter = new Intl.NumberFormat('en-MY', {
  style: 'currency',
  currency: 'MYR',
  minimumFractionDigits: 0,
});

export function OpportunityChart() {
  const { data, isLoading } = useOpportunities();

  if (isLoading) {
    return (
      <Card title="Opportunities by Stage">
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <Spin />
        </div>
      </Card>
    );
  }

  const grouped = data?.grouped;

  const chartData = STAGES.flatMap((stage) => {
    const opportunities = grouped?.[stage] ?? [];
    const totalValue = opportunities.reduce((sum, o) => sum + Number(o.value), 0);
    return [
      { stage, metric: 'Count', value: opportunities.length },
      { stage, metric: 'Value (RM k)', value: Math.round(totalValue / 1000) },
    ];
  });

  const config = {
    data: chartData,
    xField: 'stage',
    yField: 'value',
    colorField: 'metric',
    group: true,
    style: { maxWidth: 40 },
    tooltip: {
      items: [
        {
          channel: 'y',
          valueFormatter: (value: number) => `${value}`,
        },
      ],
    },
  };

  return (
    <Card title="Opportunities by Stage">
      <Column {...config} />
    </Card>
  );
}
