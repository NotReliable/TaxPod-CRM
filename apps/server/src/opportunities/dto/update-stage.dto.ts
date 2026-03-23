import { IsEnum } from 'class-validator';
import { OpportunityStage } from '../opportunity-stage.enum';

export class UpdateStageDto {
  @IsEnum(OpportunityStage)
  stage: OpportunityStage;
}
