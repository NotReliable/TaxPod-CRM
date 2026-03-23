import { Controller, Post, Get, Body, Param, Res, ParseUUIDPipe } from '@nestjs/common';
import { Response } from 'express';
import { AgentService } from './agent.service';
import { LeadsService } from '../leads/leads.service';
import { OpportunitiesService } from '../opportunities/opportunities.service';
import { ActivitiesService } from '../activities/activities.service';
import { EventSource } from '../events/event-types';

@Controller('agent')
export class AgentController {
  constructor(
    private readonly agentService: AgentService,
    private readonly leadsService: LeadsService,
    private readonly opportunitiesService: OpportunitiesService,
    private readonly activitiesService: ActivitiesService,
  ) {}

  @Post('chat')
  async chat(@Body() body: Record<string, any>, @Res() res: Response) {
    const messages = body.messages || [];
    const lastUserMsg = messages.filter((m: any) => m.role === 'user').pop();
    const message = lastUserMsg?.content || body.message || '';
    const conversationId = body.conversationId;

    try {
      const { result, conversation } = await this.agentService.chat(message, conversationId);

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Conversation-Id', conversation.id);

      const stream = result.toDataStream();
      const reader = stream.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(decoder.decode(value));
        }
      } finally {
        res.end();
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: { code: 'AGENT_ERROR', message: 'Failed to process your request. Please try again.' },
      });
    }
  }

  @Post('tools/:toolName/execute')
  async executeTool(@Param('toolName') toolName: string, @Body() params: Record<string, unknown>) {
    switch (toolName) {
      case 'create_lead':
        return this.leadsService.create(params as any, EventSource.AGENT);
      case 'update_lead': {
        const { id, ...dto } = params as any;
        return this.leadsService.update(id, dto, EventSource.AGENT);
      }
      case 'create_opportunity':
        return this.opportunitiesService.create(params as any, EventSource.AGENT);
      case 'update_opportunity_stage': {
        const { id, stage } = params as any;
        return this.opportunitiesService.updateStage(id, stage, EventSource.AGENT);
      }
      case 'log_activity':
        return this.activitiesService.create(params as any, EventSource.AGENT);
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  }

  @Get('conversations')
  listConversations() {
    return this.agentService.listConversations();
  }

  @Get('conversations/:id')
  getConversation(@Param('id', ParseUUIDPipe) id: string) {
    return this.agentService.getConversation(id);
  }
}
