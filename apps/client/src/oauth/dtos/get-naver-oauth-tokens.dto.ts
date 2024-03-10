import { NaverOAuthConfigReturnType } from '@libs/configs';
import QueryString from 'qs';

import { OAuthStateDto } from './oauth-state.dto';

export class GetNaverOAuthTokensDto {
  readonly url = 'https://nid.naver.com/oauth2.0/token';

  constructor(code: string, state: OAuthStateDto, naverOAuthConfig: NaverOAuthConfigReturnType) {
    this.url += `?${QueryString.stringify({
      grant_type: 'authorization_code',
      code,
      client_id: naverOAuthConfig.clientId,
      client_secret: naverOAuthConfig.clientSecret,
      redirect_uri: naverOAuthConfig.redirectUri,
      state: state.encode(),
    })}`;
  }
}
