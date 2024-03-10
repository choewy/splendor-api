import { AxiosHeaders } from 'axios';

export class GetKakaoOAuthProfileDto {
  readonly url = 'https://kapi.kakao.com/v2/user/me?secure_resource=true';
  readonly headers = new AxiosHeaders();

  constructor(accessToken: string) {
    this.headers.set('Authorization', `Bearer ${accessToken}`);
  }
}
