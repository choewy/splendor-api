import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileNicnameDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  nickname: string;
}
