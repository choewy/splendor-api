import { Injectable } from '@nestjs/common';

import { AbstractConfigService } from '../abstracts';

@Injectable()
export class NaverOAuthConfigService extends AbstractConfigService {
  private readonly NAVER_OAUTH_CLIENT_ID = this.configService.get<string>('NAVER_OAUTH_CLIENT_ID');
  private readonly NAVER_OAUTH_CLIENT_SECRET = this.configService.get<string>('NAVER_OAUTH_CLIENT_SECRET');
  private readonly NAVER_OAUTH_STATE = this.configService.get<string>('NAVER_OAUTH_STATE');
  private readonly NAVER_OAUTH_REDIRECT_URI = this.configService.get<string>('NAVER_OAUTH_REDIRECT_URI');

  getClientId() {
    return this.NAVER_OAUTH_CLIENT_ID;
  }

  getClientSecret() {
    return this.NAVER_OAUTH_CLIENT_SECRET;
  }

  getState() {
    return this.NAVER_OAUTH_STATE;
  }

  getRedirectUri() {
    return this.NAVER_OAUTH_REDIRECT_URI;
  }
}
