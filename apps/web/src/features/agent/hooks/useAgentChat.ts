import { useChat } from '@ai-sdk/react';
import { api } from '@/shared/api/client';

export function useAgentChat(conversationId?: string) {
  const chat = useChat({
    api: '/api/agent/chat',
    body: { conversationId },
  });

  const executeToolAndAddResult = async (
    toolCallId: string,
    toolName: string,
    args: Record<string, unknown>,
  ) => {
    try {
      const result = await api.post(`/agent/tools/${toolName}/execute`, args);
      chat.addToolResult({ toolCallId, result: JSON.stringify(result) });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown error';
      chat.addToolResult({
        toolCallId,
        result: JSON.stringify({ error: message }),
      });
    }
  };

  const rejectToolCall = (toolCallId: string) => {
    chat.addToolResult({
      toolCallId,
      result: JSON.stringify({ error: 'User rejected this action' }),
    });
  };

  return {
    ...chat,
    executeToolAndAddResult,
    rejectToolCall,
  };
}
