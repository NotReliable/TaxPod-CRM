import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { streamText, convertToModelMessages, stepCountIs } from 'ai';
import type { UIMessage } from 'ai';
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

  async chat(messageText: string, uiMessages: any[]): Promise<{ result: any }> {
    const tools = createAgentTools(this.leadsService, this.opportunitiesService);

    // Convert UI messages to model messages for the LLM
    const modelMessages = await convertToModelMessages(uiMessages as UIMessage[]);

    const result = streamText({
      model: getModel(),
      system: getSystemPrompt(),
      messages: modelMessages,
      tools,
      stopWhen: stepCountIs(10),
    });

    return { result };
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
