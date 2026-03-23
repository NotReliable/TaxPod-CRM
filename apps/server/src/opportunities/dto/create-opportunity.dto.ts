import { IsString, IsNumber, IsUUID, IsOptional, IsEnum, Min } from 'class-validator';
import { OpportunityStage } from '../opportunity-stage.enum';

export class CreateOpportunityDto {
  @IsString()
  title: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  value: number;

  @IsUUID()
  leadId: string;

  @IsOptional()
  @IsEnum(OpportunityStage)
  stage?: OpportunityStage;
}
