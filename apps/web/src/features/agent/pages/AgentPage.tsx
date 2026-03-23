import { PageHeader } from '@/shared/components/PageHeader';
import { useAgentChat } from '../hooks/useAgentChat';
import { ChatWindow } from '../components/ChatWindow';

export function Component() {
  const {
    messages,
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    setInput,
    executeToolAndAddResult,
    rejectToolCall,
  } = useAgentChat();

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
