import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateStudioCommand {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @MinLength(1)
  alias: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  introduction?: string;
}
