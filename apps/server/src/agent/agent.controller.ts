import { Controller, Post, Get, Body, Param, Res, ParseUUIDPipe, Req } from '@nestjs/common';
import { Response, Request } from 'express';
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
  async chat(@Req() req: Request, @Res() res: Response) {
    // Bypass NestJS ValidationPipe by reading raw body from request
    const body = req.body;
    const messages = body.messages || [];

    // AI SDK v6 UIMessage uses 'parts' array, not 'content' string
    const lastUserMsg = [...messages].reverse().find((m: any) => m.role === 'user');
    let messageText = '';
    if (lastUserMsg) {
      if (lastUserMsg.parts) {
        const textPart = lastUserMsg.parts.find((p: any) => p.type === 'text');
        messageText = textPart?.text || '';
      } else if (typeof lastUserMsg.content === 'string') {
        messageText = lastUserMsg.content;
      }
    }

    try {
      const { result } = await this.agentService.chat(messageText, messages);

      result.pipeUIMessageStreamToResponse(res as any);
    } catch (error) {
      console.error('Agent chat error:', error);
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
