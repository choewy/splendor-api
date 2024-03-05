import { OAuthPlatform } from '@entities/oauth.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class GetAuthorizeUrlDto {
  @ApiProperty({ type: String, enum: OAuthPlatform })
  @IsNotEmpty()
  @IsEnum(OAuthPlatform)
  platform: OAuthPlatform;
}
