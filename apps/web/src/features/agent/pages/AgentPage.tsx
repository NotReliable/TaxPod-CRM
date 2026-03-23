import { useState } from 'react';
import { PageHeader } from '@/shared/components/PageHeader';
import { useAgentChat } from '../hooks/useAgentChat';
import { ChatWindow } from '../components/ChatWindow';

export function Component() {
  const [input, setInput] = useState('');
  const {
    messages,
    status,
    sendMessage,
    executeToolAndAddResult,
    rejectToolCall,
  } = useAgentChat();

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault?.();
    const trimmed = input.trim();
    if (!trimmed) return;
    sendMessage({ text: trimmed });
    setInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 112px)' }}>
      <PageHeader title="AI Agent" />
      <div
        style={{
          flex: 1,
          minHeight: 0,
          background: '#fff',
          borderRadius: 8,
          border: '1px solid #f0f0f0',
        }}
      >
        <ChatWindow
          messages={messages}
          input={input}
          isLoading={isLoading}
          onInputChange={(value) => setInput(value)}
          onSubmit={handleSubmit}
          executeToolAndAddResult={executeToolAndAddResult}
          rejectToolCall={rejectToolCall}
        />
      </div>
    </div>
  );
}
