import { AxiosHeaders } from 'axios';

export class GetGoogleOAuthProfileDto {
  readonly url = 'https://www.googleapis.com/userinfo/v2/me';
  readonly headers = new AxiosHeaders();

  constructor(accessToken: string) {
    this.headers.set('Authorization', `Bearer ${accessToken}`);
  }
}
