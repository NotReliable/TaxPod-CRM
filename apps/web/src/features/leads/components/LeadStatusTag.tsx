import { Tag } from 'antd';
import type { LeadStatus } from '@/shared/types/models';

const statusColors: Record<LeadStatus, string> = {
  Lead: 'blue',
  Prospect: 'orange',
  Customer: 'green',
};

export function LeadStatusTag({ status }: { status: LeadStatus }) {
  return <Tag color={statusColors[status]}>{status}</Tag>;
}
