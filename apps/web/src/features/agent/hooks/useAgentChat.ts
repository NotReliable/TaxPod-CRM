import { useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { api } from '@/shared/api/client';

const STORAGE_KEY = 'taxpod-agent-chat';

function loadMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useAgentChat(conversationId?: string) {
  const chat = useChat({
    messages: loadMessages(),
    transport: new DefaultChatTransport({
      api: '/api/agent/chat',
      body: { conversationId },
    }) as any,
    // After a tool output is added (confirm/reject), automatically send
    // a follow-up request so the LLM can see the result and respond.
    // Only trigger if the LAST part is a tool with output — once the LLM
    // responds with text, the last part becomes text and this returns false.
    sendAutomaticallyWhen: ({ messages }: { messages: any[] }) => {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg?.role !== 'assistant' || !lastMsg.parts?.length) return false;
      const lastPart = lastMsg.parts[lastMsg.parts.length - 1];
      return (
        lastPart.type?.startsWith('tool-') &&
        (lastPart.state === 'output-available' || lastPart.state === 'output-error')
      );
    },
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

  // Persist messages to localStorage on every change
  useEffect(() => {
    if (chat.messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chat.messages));
    }
  }, [chat.messages]);

  const clearChat = () => {
    localStorage.removeItem(STORAGE_KEY);
    chat.setMessages([]);
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
    clearChat,
  };
}
