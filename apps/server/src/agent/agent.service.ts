import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { streamText, stepCountIs } from 'ai';
import { AgentConversation } from './entities/agent-conversation.entity';
import { AgentMessage, MessageRole } from './entities/agent-message.entity';
import { getModel } from './providers/llm.provider';
import { getSystemPrompt } from './prompts/system.prompt';
import { createAgentTools } from './tools';
import { LeadsService } from '../leads/leads.service';
import { OpportunitiesService } from '../opportunities/opportunities.service';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(AgentConversation)
    private readonly conversationRepo: Repository<AgentConversation>,
    @InjectRepository(AgentMessage)
    private readonly messageRepo: Repository<AgentMessage>,
    private readonly leadsService: LeadsService,
    private readonly opportunitiesService: OpportunitiesService,
  ) {}

  async getOrCreateConversation(conversationId?: string) {
    if (conversationId) {
      const conv = await this.conversationRepo.findOne({ where: { id: conversationId } });
      if (conv) return conv;
    }
    return this.conversationRepo.save(this.conversationRepo.create({ title: null }));
  }

  async getConversationMessages(conversationId: string) {
    return this.messageRepo.find({ where: { conversationId }, order: { createdAt: 'ASC' } });
  }

  async chat(message: string, conversationId?: string): Promise<{ result: any; conversation: AgentConversation }> {
    const conversation = await this.getOrCreateConversation(conversationId);

    // Save user message
    await this.messageRepo.save(
      this.messageRepo.create({ conversationId: conversation.id, role: MessageRole.USER, content: message }),
    );

    // Build message history for LLM
    const history = await this.getConversationMessages(conversation.id);
    const messages = history.map((msg) => {
      if (msg.role === MessageRole.ASSISTANT && msg.toolCalls) {
        return {
          role: 'assistant' as const,
          content: [
            ...(msg.content ? [{ type: 'text' as const, text: msg.content }] : []),
            ...msg.toolCalls.map((tc: any) => ({
              type: 'tool-call' as const, toolCallId: tc.toolCallId, toolName: tc.toolName, input: tc.args ?? tc.input,
            })),
          ],
        };
      }
      if (msg.role === MessageRole.TOOL && msg.toolResults) {
        return {
          role: 'tool' as const,
          content: msg.toolResults.map((tr: any) => ({
            type: 'tool-result' as const, toolCallId: tr.toolCallId, toolName: tr.toolName ?? '',
            output: tr.result ?? tr.output,
          })),
        };
      }
      return { role: msg.role as 'user' | 'assistant', content: msg.content || '' };
    });

    const tools = createAgentTools(this.leadsService, this.opportunitiesService);

    const result = streamText({
      model: getModel(),
      system: getSystemPrompt(),
      messages: messages as any,
      tools,
      stopWhen: stepCountIs(10),
      onFinish: async ({ text, toolCalls, toolResults }) => {
        if (text) {
          await this.messageRepo.save(
            this.messageRepo.create({
              conversationId: conversation.id, role: MessageRole.ASSISTANT,
              content: text, toolCalls: toolCalls?.length ? toolCalls : null,
            }),
          );
        }
        if (toolResults?.length) {
          await this.messageRepo.save(
            this.messageRepo.create({ conversationId: conversation.id, role: MessageRole.TOOL, toolResults }),
          );
        }
      },
    });

    return { result, conversation };
  }

  async listConversations() {
    return this.conversationRepo.find({ order: { updatedAt: 'DESC' }, take: 20 });
  }

  async getConversation(id: string) {
    return this.conversationRepo.findOne({
      where: { id }, relations: ['messages'],
      order: { messages: { createdAt: 'ASC' } } as any,
    });
  }
}
