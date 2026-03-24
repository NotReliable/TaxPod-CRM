import { Timeline, Typography } from 'antd';
import {
  PhoneOutlined,
  MailOutlined,
  TeamOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import dayjs from '@/shared/utils/dayjs';
import type { ActivityLog, ActivityType } from '@/shared/types/models';

const typeIcons: Record<ActivityType, React.ReactNode> = {
  Call: <PhoneOutlined />,
  Email: <MailOutlined />,
  Meeting: <TeamOutlined />,
  Note: <FileTextOutlined />,
};

const typeColors: Record<ActivityType, string> = {
  Call: '#1890ff',
  Email: '#52c41a',
  Meeting: '#722ed1',
  Note: '#faad14',
};

interface Props {
  activities: ActivityLog[];
}

export function ActivityTimeline({ activities }: Props) {
  const items = activities.map((activity) => ({
    key: activity.id,
    dot: typeIcons[activity.type],
    color: typeColors[activity.type],
    children: (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Typography.Text strong>{activity.type}</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(activity.date).format('DD MMM YYYY, h:mm A')}
          </Typography.Text>
        </div>
        <div style={{ marginTop: 4 }}>
          <Typography.Paragraph style={{ margin: 0 }}>
            {activity.description}
          </Typography.Paragraph>
        </div>
        <div style={{ marginTop: 4, display: 'flex', gap: 12 }}>
          {activity.lead && (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Lead: {activity.lead.name}
            </Typography.Text>
          )}
          {activity.opportunity && (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Opportunity: {activity.opportunity.title}
            </Typography.Text>
          )}
        </div>
      </div>
    ),
  }));

  return <Timeline items={items} />;
}
