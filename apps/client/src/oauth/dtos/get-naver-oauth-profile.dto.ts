import { AxiosHeaders } from 'axios';

export class GetNaverOAuthProfileDto {
  readonly url = 'https://openapi.naver.com/v1/nid/me';
  readonly headers = new AxiosHeaders();

  constructor(accessToken: string) {
    this.headers.set('Authorization', `Bearer ${accessToken}`);
  }
}
