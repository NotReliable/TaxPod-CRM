import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { OpportunityStage } from '../opportunity-stage.enum';

export class UpdateOpportunityDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  value?: number;

  @IsOptional()
  @IsEnum(OpportunityStage)
  stage?: OpportunityStage;
}
