import { OAuthPlatform } from '@libs/entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class GetOAuthAuthorizeUrlDto {
  @ApiProperty({ type: String, enum: OAuthPlatform })
  @IsEnum(OAuthPlatform)
  platform: OAuthPlatform;
}
