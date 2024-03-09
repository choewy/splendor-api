import { NaverOAuthConfigReturnType } from '@libs/configs';
import QueryString from 'qs';

import { CreateOAuthUrlDto } from './create-oauth-url.dto';
import { OAuthStateDto } from './oauth-state.dto';

export class CreateNaverOAuthUrlDto implements CreateOAuthUrlDto {
  url = 'https://nid.naver.com/oauth2.0/authorize';

  constructor(naverOAuthConfig: NaverOAuthConfigReturnType, redirectUrl: string, userId?: number) {
    this.url += `?${QueryString.stringify({
      response_type: 'code',
      client_id: naverOAuthConfig.clientId,
      redirect_uri: naverOAuthConfig.redirectUri,
      state: new OAuthStateDto(redirectUrl, userId).encode(),
    })}`;
  }
}
