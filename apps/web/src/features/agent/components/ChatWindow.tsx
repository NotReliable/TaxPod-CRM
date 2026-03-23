import { useRef, useEffect } from 'react';
import { Button, Input, Spin } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import type { UIMessage } from '@ai-sdk/react';
import { MessageBubble } from './MessageBubble';
import { ToolCallCard } from './ToolCallCard';
import { ConfirmationCard } from './ConfirmationCard';
import { WRITE_TOOLS } from '../types';

interface Props {
  messages: UIMessage[];
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  executeToolAndAddResult: (
    toolCallId: string,
    toolName: string,
    args: Record<string, unknown>,
  ) => Promise<void>;
  rejectToolCall: (toolCallId: string, toolName: string) => void;
}

function isToolPart(part: { type: string }): boolean {
  return part.type.startsWith('tool-') && part.type !== 'tool-result';
}

function extractToolName(partType: string): string {
  // ToolUIPart type is `tool-${toolName}`, e.g. "tool-search_leads"
  return partType.replace(/^tool-/, '');
}

export function ChatWindow({
  messages,
  input,
  isLoading,
  onInputChange,
  onSubmit,
  executeToolAndAddResult,
  rejectToolCall,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
      }}
    >
      {/* Message list */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 16px 0',
          minHeight: 0,
        }}
      >
        {messages.map((message) => (
          <div key={message.id}>
            {message.parts.map((part, index) => {
              // Text content parts
              if (part.type === 'text' && part.text) {
                return (
                  <MessageBubble
                    key={`${message.id}-text-${index}`}
                    role={message.role as 'user' | 'assistant'}
                    content={part.text}
                  />
                );
              }

              // Tool invocation parts (type is `tool-${toolName}`)
              if (isToolPart(part)) {
                const toolPart = part as any;
                const toolName = extractToolName(part.type);
                const args = (toolPart.input ?? {}) as Record<string, unknown>;
                const isWriteTool = WRITE_TOOLS.includes(toolName);

                if (toolPart.state === 'output-available' || toolPart.state === 'output-error') {
                  const resultText =
                    toolPart.state === 'output-error'
                      ? toolPart.errorText
                      : typeof toolPart.output === 'string'
                        ? toolPart.output
                        : JSON.stringify(toolPart.output);
                  return (
                    <ToolCallCard
                      key={toolPart.toolCallId}
                      toolName={toolName}
                      args={args}
                      result={resultText}
                    />
                  );
                }

                if (toolPart.state === 'input-available' && isWriteTool) {
                  return (
                    <ConfirmationCard
                      key={toolPart.toolCallId}
                      toolCallId={toolPart.toolCallId}
                      toolName={toolName}
                      args={args}
                      onConfirm={executeToolAndAddResult}
                      onReject={rejectToolCall}
                    />
                  );
                }

                // Read tool still in 'input-available' state (waiting for auto-execution result)
                if (toolPart.state === 'input-available') {
                  return (
                    <ToolCallCard
                      key={toolPart.toolCallId}
                      toolName={toolName}
                      args={args}
                    />
                  );
                }
              }

              return null;
            })}
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
            <Spin size="small" />
          </div>
        )}
      </div>

      {/* Input area */}
      <div
        style={{
          padding: 16,
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          gap: 8,
          alignItems: 'flex-end',
        }}
      >
        <Input.TextArea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          style={{ flex: 1 }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={(e) => onSubmit(e as unknown as React.FormEvent)}
          disabled={!input.trim() || isLoading}
        />
      </div>
    </div>
  );
}
