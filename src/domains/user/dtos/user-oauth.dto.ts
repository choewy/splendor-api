import { OAuthEntity, OAuthPlatform } from '@entities/oauth.entity';
import { ApiResponseProperty } from '@nestjs/swagger';

export class UserOAuthDto {
  @ApiResponseProperty({ type: Number })
  id: number;

  @ApiResponseProperty({ type: String, enum: OAuthPlatform })
  platform: OAuthPlatform;

  @ApiResponseProperty({ type: String, format: 'email' })
  email: string | null;

  @ApiResponseProperty({ type: String })
  profileImageUrl: string;

  @ApiResponseProperty({ type: Date })
  connectedAt: Date;

  @ApiResponseProperty({ type: Boolean })
  isCurrent: boolean;

  constructor(oauth: OAuthEntity, currentOAuthPlatform?: OAuthPlatform) {
    this.id = oauth.id;
    this.platform = oauth.platform;
    this.email = oauth.email;
    this.profileImageUrl = oauth.profileImageUrl;
    this.isCurrent = oauth.platform === currentOAuthPlatform;
    this.connectedAt = oauth.createdAt;
  }
}
