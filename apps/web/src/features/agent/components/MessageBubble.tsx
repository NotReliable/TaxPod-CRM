import dayjs from '@/shared/utils/dayjs';
import { Typography } from 'antd';

interface Props {
  role: 'user' | 'assistant';
  content: string;
  createdAt?: Date;
}

export function MessageBubble({ role, content, createdAt }: Props) {
  const isUser = role === 'user';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 12,
      }}
    >
      <div
        style={{
          maxWidth: '70%',
          padding: '10px 14px',
          borderRadius: 12,
          backgroundColor: isUser ? '#1677ff' : '#f5f5f5',
          color: isUser ? '#fff' : 'rgba(0, 0, 0, 0.88)',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
        }}
      >
        <div>{content}</div>
        {createdAt && (
          <Typography.Text
            style={{
              fontSize: 11,
              color: isUser ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.45)',
              display: 'block',
              marginTop: 4,
              textAlign: 'right',
            }}
          >
            {dayjs(createdAt).format('HH:mm')}
          </Typography.Text>
        )}
      </div>
    </div>
  );
}
