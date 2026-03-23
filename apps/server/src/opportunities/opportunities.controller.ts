import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseUUIDPipe,
} from '@nestjs/common';
import { OpportunitiesService } from './opportunities.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { SearchOpportunityDto } from './dto/search-opportunity.dto';

@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Get()
  search(@Query() dto: SearchOpportunityDto) {
    return this.opportunitiesService.search(dto);
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.opportunitiesService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateOpportunityDto) {
    return this.opportunitiesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateOpportunityDto) {
    return this.opportunitiesService.update(id, dto);
  }

  @Patch(':id/stage')
  updateStage(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateStageDto) {
    return this.opportunitiesService.updateStage(id, dto.stage);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.opportunitiesService.delete(id);
  }
}
