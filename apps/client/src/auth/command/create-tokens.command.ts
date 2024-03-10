import { OAuthPlatform } from '@libs/entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export class CreateTokensCommand {
  @ApiProperty({ type: Number })
  @IsInt()
  @Min(1)
  id: number;

  @ApiPropertyOptional({ type: String, enum: OAuthPlatform })
  @IsOptional()
  @IsEnum(OAuthPlatform)
  platform?: OAuthPlatform;
}
