import { OAuthPlatform } from '@entities/oauth.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class GetOAuthAuthorizeUrlDto {
  @ApiProperty({ type: String, enum: OAuthPlatform })
  @IsNotEmpty()
  @IsEnum(OAuthPlatform)
  platform: OAuthPlatform;
}
