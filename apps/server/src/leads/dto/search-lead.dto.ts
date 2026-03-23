import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { LeadStatus } from '../lead-status.enum';

export class SearchLeadDto extends PaginationDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;
}
