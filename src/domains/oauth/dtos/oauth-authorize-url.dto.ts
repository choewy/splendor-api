import { OAuthPlatform } from '@entities/oauth.entity';
import { ApiResponseProperty } from '@nestjs/swagger';

export class OAuthAuthorizeUrlDto {
  @ApiResponseProperty({ type: String, enum: OAuthPlatform })
  platform: OAuthPlatform;

  @ApiResponseProperty({ type: String })
  url: string;

  constructor(platform: OAuthPlatform, url: string) {
    this.platform = platform;
    this.url = url;
  }
}
