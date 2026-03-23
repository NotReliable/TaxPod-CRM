import { Typography } from 'antd';

interface Props {
  title: string;
  extra?: React.ReactNode;
}

export function PageHeader({ title, extra }: Props) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
      <Typography.Title level={4} style={{ margin: 0 }}>{title}</Typography.Title>
      {extra}
    </div>
  );
}
