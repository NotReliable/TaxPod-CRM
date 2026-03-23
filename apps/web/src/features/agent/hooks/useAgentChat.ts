import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { api } from '@/shared/api/client';

export function useAgentChat(conversationId?: string) {
  const chat = useChat({
    // DefaultChatTransport from ai@6 is structurally compatible with
    // the ChatTransport expected by @ai-sdk/react, but pnpm resolves
    // them to different package instances, so we cast to avoid the
    // nominal type mismatch.
    transport: new DefaultChatTransport({
      api: '/api/agent/chat',
      body: { conversationId },
    }) as any,
  });

  const executeToolAndAddResult = async (
    toolCallId: string,
    toolName: string,
    args: Record<string, unknown>,
  ) => {
    try {
      const result = await api.post(`/agent/tools/${toolName}/execute`, args);
      chat.addToolOutput({
        toolCallId,
        tool: toolName,
        output: JSON.stringify(result),
      } as any);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown error';
      chat.addToolOutput({
        toolCallId,
        tool: toolName,
        state: 'output-error',
        errorText: message,
      } as any);
    }
  };

  const rejectToolCall = (toolCallId: string, toolName: string) => {
    chat.addToolOutput({
      toolCallId,
      tool: toolName,
      state: 'output-error',
      errorText: 'User rejected this action',
    } as any);
  };

  return {
    ...chat,
    executeToolAndAddResult,
    rejectToolCall,
  };
}
