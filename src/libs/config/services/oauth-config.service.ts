import { AbstractConfigService } from '@libs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OAuthConfigService extends AbstractConfigService {
  private readonly SIGN_REDIRECT_URL = this.configService.get<string>('SIGN_REDIRECT_URL');

  getRedirectUrl(): string {
    return this.SIGN_REDIRECT_URL;
  }
}
