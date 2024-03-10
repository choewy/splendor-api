import { KakaoOAuthConfigReturnType } from '@libs/configs';
import { AxiosHeaders } from 'axios';

export class GetKakaoOAuthTokensDto {
  readonly url = 'https://kauth.kakao.com/oauth/token';
  readonly body: object;
  readonly headers = new AxiosHeaders();

  constructor(code: string, kakaoOAuthConfig: KakaoOAuthConfigReturnType) {
    this.body = {
      grant_type: 'authorization_code',
      code,
      client_id: kakaoOAuthConfig.clientId,
      redirect_uri: kakaoOAuthConfig.redirectUri,
    };

    this.headers.set('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
  }
}
