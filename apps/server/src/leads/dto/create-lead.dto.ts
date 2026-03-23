import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { LeadStatus } from '../lead-status.enum';

export class CreateLeadDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;
}
