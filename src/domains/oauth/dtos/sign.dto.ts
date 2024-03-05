import { OAuthPlatform } from '@entities/oauth.entity';
import { ApiResponseProperty } from '@nestjs/swagger';

export class SignDto {
  @ApiResponseProperty({ type: String, enum: OAuthPlatform })
  platform: OAuthPlatform;

  @ApiResponseProperty({ type: String })
  accessToken: string;

  constructor(platform: OAuthPlatform, accessToken: string) {
    this.platform = platform;
    this.accessToken = accessToken;
  }
}
