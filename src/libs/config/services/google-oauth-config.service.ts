import { Injectable } from '@nestjs/common';

import { AbstractConfigService } from '../abstracts';

@Injectable()
export class GoogleOAuthConfigService extends AbstractConfigService {
  private readonly GOOGLE_OAUTH_CLIENT_ID = this.configService.get<string>('GOOGLE_OAUTH_CLIENT_ID');
  private readonly GOOGLE_OAUTH_CLIENT_SECRET = this.configService.get<string>('GOOGLE_OAUTH_CLIENT_SECRET');
  private readonly GOOGLE_OAUTH_REDIRECT_URI = this.configService.get<string>('GOOGLE_OAUTH_REDIRECT_URI');

  getClientId() {
    return this.GOOGLE_OAUTH_CLIENT_ID;
  }

  getClientSecret() {
    return this.GOOGLE_OAUTH_CLIENT_SECRET;
  }

  getRedirectUri() {
    return this.GOOGLE_OAUTH_REDIRECT_URI;
  }
}
