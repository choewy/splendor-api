import { registerAs } from '@nestjs/config';

export type GoogleOAuthConfigReturnType = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

export const GOOGLE_OAUTH_CONFIG = '__google_oauth_config__';

export const GoogleOAuthConfig = registerAs(
  GOOGLE_OAUTH_CONFIG,
  (): GoogleOAuthConfigReturnType => ({
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URI,
  }),
);
