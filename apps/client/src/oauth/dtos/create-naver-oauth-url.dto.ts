import { NaverOAuthConfigReturnType } from '@libs/configs';
import QueryString from 'qs';

import { CreateOAuthUrlDto } from './create-oauth-url.dto';

export class CreateNaverOAuthUrlDto implements CreateOAuthUrlDto {
  url = 'https://nid.naver.com/oauth2.0/authorize';

  constructor(naverOAuthConfig: NaverOAuthConfigReturnType, userId?: number) {
    this.url += `?${QueryString.stringify({
      response_type: 'code',
      client_id: naverOAuthConfig.clientId,
      redirect_uri: naverOAuthConfig.redirectUri,
      state: userId ?? naverOAuthConfig.state,
    })}`;
  }
}
