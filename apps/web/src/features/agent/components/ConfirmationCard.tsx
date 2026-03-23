import { useState } from 'react';
import { Button, Card, Descriptions, Tag, Typography } from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  ToolOutlined,
} from '@ant-design/icons';

interface Props {
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
  onConfirm: (
    toolCallId: string,
    toolName: string,
    args: Record<string, unknown>,
  ) => Promise<void>;
  onReject: (toolCallId: string, toolName: string) => void;
}

function formatToolName(name: string): string {
  return name
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function ConfirmationCard({
  toolCallId,
  toolName,
  args,
  onConfirm,
  onReject,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>(
    'pending',
  );

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(toolCallId, toolName, args);
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = () => {
    onReject(toolCallId, toolName);
  };

  const resolved = status !== 'pending';

  return (
    <div style={{ marginBottom: 12, maxWidth: '70%' }}>
      <Card
        size="small"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Tag
              icon={<ToolOutlined />}
              color="warning"
              style={{ margin: 0 }}
            >
              Action
            </Tag>
            <span>{formatToolName(toolName)}</span>
          </div>
        }
        extra={
          status === 'success' ? (
            <Tag color="success">Confirmed</Tag>
          ) : status === 'error' ? (
            <Tag color="error">Failed</Tag>
          ) : null
        }
      >
        <Descriptions column={1} size="small" style={{ marginBottom: 12 }}>
          {Object.entries(args).map(([key, value]) => (
            <Descriptions.Item
              key={key}
              label={
                <Typography.Text strong style={{ fontSize: 13 }}>
                  {key}
                </Typography.Text>
              }
            >
              <Typography.Text style={{ fontSize: 13 }}>
                {typeof value === 'string' ? value : JSON.stringify(value)}
              </Typography.Text>
            </Descriptions.Item>
          ))}
        </Descriptions>

        {!resolved && (
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              loading={loading}
              onClick={handleConfirm}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              Confirm
            </Button>
            <Button
              danger
              icon={<CloseOutlined />}
              disabled={loading}
              onClick={handleReject}
            >
              Reject
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
