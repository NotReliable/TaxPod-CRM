import { IsEnum, IsString, IsDateString, IsOptional, IsUUID } from 'class-validator';
import { ActivityType } from '../activity-type.enum';

export class CreateActivityDto {
  @IsEnum(ActivityType)
  type: ActivityType;

  @IsString()
  description: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsUUID()
  leadId?: string;

  @IsOptional()
  @IsUUID()
  opportunityId?: string;
}
