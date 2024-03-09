import { GoogleOAuthConfigReturnType } from '@libs/configs';

export class GetGoogleOAuthTokensDto {
  readonly url = 'https://oauth2.googleapis.com/token';
  readonly body: object;

  constructor(code: string, googleOAuthconfig: GoogleOAuthConfigReturnType) {
    this.body = {
      grant_type: 'authorization_code',
      code,
      client_id: googleOAuthconfig.clientId,
      client_secret: googleOAuthconfig.clientSecret,
      redirect_uri: googleOAuthconfig.redirectUri,
    };
  }
}
