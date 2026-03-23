import { Empty } from 'antd';

interface Props {
  description?: string;
  children?: React.ReactNode;
}

export function EmptyState({ description = 'No data', children }: Props) {
  return (
    <Empty description={description} style={{ padding: 48 }}>
      {children}
    </Empty>
  );
}
