import { Card, Collapse, Tag, Typography } from 'antd';
import { ToolOutlined } from '@ant-design/icons';

interface Props {
  toolName: string;
  args: Record<string, unknown>;
  result?: string;
}

function formatToolName(name: string): string {
  return name
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatArgs(args: Record<string, unknown>): string {
  return Object.entries(args)
    .map(([key, value]) => `${key}: ${typeof value === 'string' ? value : JSON.stringify(value)}`)
    .join(', ');
}

export function ToolCallCard({ toolName, args, result }: Props) {
  return (
    <div style={{ marginBottom: 12, maxWidth: '70%' }}>
      <Card
        size="small"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Tag
              icon={<ToolOutlined />}
              color="processing"
              style={{ margin: 0 }}
            >
              Tool
            </Tag>
            <span>{formatToolName(toolName)}</span>
          </div>
        }
      >
        <Typography.Text type="secondary" style={{ fontSize: 13 }}>
          {formatArgs(args)}
        </Typography.Text>

        {result && (
          <Collapse
            size="small"
            style={{ marginTop: 8 }}
            items={[
              {
                key: 'result',
                label: 'Result',
                children: (
                  <pre
                    style={{
                      margin: 0,
                      fontSize: 12,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      maxHeight: 200,
                      overflow: 'auto',
                    }}
                  >
                    {(() => {
                      try {
                        return JSON.stringify(JSON.parse(result), null, 2);
                      } catch {
                        return result;
                      }
                    })()}
                  </pre>
                ),
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
}
