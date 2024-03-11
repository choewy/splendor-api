import { OAuthEntity, OAuthPlatform } from '@libs/entity';
import { ApiResponseProperty } from '@nestjs/swagger';

export class ProfileOAuthDto {
  @ApiResponseProperty({ type: Number })
  id: number;

  @ApiResponseProperty({ type: String, enum: OAuthPlatform })
  platform: OAuthPlatform;

  @ApiResponseProperty({ type: String })
  nickname: string | null;

  @ApiResponseProperty({ type: String, format: 'email' })
  email: string | null;

  @ApiResponseProperty({ type: String })
  profileImageUrl: string | null;

  @ApiResponseProperty({ type: Date })
  connetedAt: Date;

  @ApiResponseProperty({ type: Date })
  updatedAt: Date;

  constructor(oauth: OAuthEntity) {
    this.id = oauth.id;
    this.platform = oauth.platform;
    this.nickname = oauth.nickname ?? null;
    this.email = oauth.email ?? null;
    this.profileImageUrl = oauth.profileImageUrl;
    this.connetedAt = oauth.createdAt;
    this.updatedAt = oauth.updatedAt;
  }
}
