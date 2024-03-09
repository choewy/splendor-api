import { GOOGLE_OAUTH_CONFIG, KAKAO_OAUTH_CONFIG, NAVER_OAUTH_CONFIG } from '@libs/configs';
import { OAuthPlatform, OAuthRepository } from '@libs/entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreateGoogleOAuthUrlDto, CreateKakaoOAuthUrlDto, CreateNaverOAuthUrlDto } from '../dtos';

@Injectable()
export class OAuthService {
  constructor(private readonly oauthRepository: OAuthRepository, private readonly configService: ConfigService) {}

  getOAuthAuthorizeUrl(platform: OAuthPlatform) {
    switch (platform) {
      case OAuthPlatform.Google:
        return new CreateGoogleOAuthUrlDto(this.configService.get(GOOGLE_OAUTH_CONFIG));

      case OAuthPlatform.Kakao:
        return new CreateKakaoOAuthUrlDto(this.configService.get(KAKAO_OAUTH_CONFIG));

      case OAuthPlatform.Naver:
        return new CreateNaverOAuthUrlDto(this.configService.get(NAVER_OAUTH_CONFIG));
    }
  }
}
