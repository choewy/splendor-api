import { GoogleOAuthConfigReturnType } from '@libs/configs';
import QueryString from 'qs';

import { CreateOAuthUrlDto } from './create-oauth-url.dto';

export class CreateGoogleOAuthUrlDto implements CreateOAuthUrlDto {
  url = 'https://accounts.google.com/o/oauth2/v2/auth';

  constructor(googleOAuthConfig: GoogleOAuthConfigReturnType, userId?: number) {
    this.url += `?${QueryString.stringify({
      response_type: 'code',
      client_id: googleOAuthConfig.clientId,
      redirect_uri: googleOAuthConfig.redirectUri,
      state: userId,
      scope: 'email profile',
    })}`;
  }
}
