import { IsString, IsOptional, IsUUID } from 'class-validator';

export class ChatDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsUUID()
  conversationId?: string;
}
