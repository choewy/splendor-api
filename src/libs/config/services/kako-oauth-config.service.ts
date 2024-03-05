import { AbstractConfigService } from '@libs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KakaoOAuthConfigService extends AbstractConfigService {
  private readonly KAKAO_OAUTH_REST_API_KEY = this.configService.get<string>('KAKAO_OAUTH_REST_API_KEY');
  private readonly KAKAO_OAUTH_REDIRECT_URI = this.configService.get<string>('KAKAO_OAUTH_REDIRECT_URI');

  getClientId(): string {
    return this.KAKAO_OAUTH_REST_API_KEY;
  }

  getRedirectUri(): string {
    return this.KAKAO_OAUTH_REDIRECT_URI;
  }
}
