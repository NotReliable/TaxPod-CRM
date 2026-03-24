import { useEffect, useRef, useState } from 'react';
import { Card, List, Typography, Tag } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface FeedEvent {
  id: string;
  eventType: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

function formatEventType(eventType: string): string {
  return eventType
    .split('.')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getEventColor(eventType?: string): string {
  if (!eventType) return 'default';
  if (eventType.includes('created')) return 'green';
  if (eventType.includes('updated')) return 'blue';
  if (eventType.includes('deleted')) return 'red';
  return 'default';
}

function getEventDescription(event: FeedEvent): string {
  const payload = event.payload;
  if (payload.name) return String(payload.name);
  if (payload.title) return String(payload.title);
  if (payload.description) return String(payload.description);
  return formatEventType(event.eventType);
}

export function ActivityFeed() {
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const es = new EventSource('/api/dashboard/activity-feed');
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (Array.isArray(data)) {
          setEvents(data as FeedEvent[]);
        } else {
          setEvents((prev) => [data as FeedEvent, ...prev].slice(0, 50));
        }
      } catch {
        // Ignore malformed events
      }
    };

    es.onerror = () => {
      // EventSource will auto-reconnect
    };

    return () => {
      es.close();
    };
  }, []);

  return (
    <Card
      title="Activity Feed"
      styles={{ body: { maxHeight: 400, overflowY: 'auto', padding: '12px 24px' } }}
    >
      {events.length === 0 ? (
        <Typography.Text type="secondary">
          Waiting for new activity...
        </Typography.Text>
      ) : (
        <List
          dataSource={events}
          renderItem={(event) => (
            <List.Item key={event.id} style={{ padding: '8px 0' }}>
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Tag color={getEventColor(event.eventType)}>
                    {formatEventType(event.eventType)}
                  </Tag>
                  <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                    {dayjs(event.createdAt).fromNow()}
                  </Typography.Text>
                </div>
                <Typography.Text style={{ fontSize: 13, marginTop: 4, display: 'block' }}>
                  {getEventDescription(event)}
                </Typography.Text>
              </div>
            </List.Item>
          )}
        />
      )}
    </Card>
  );
}
