import { registerAs } from '@nestjs/config';

export type NaverOAuthConfigReturnType = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  state: string;
};

export const NAVER_OAUTH_CONFIG = '__naver_oauth_config__';

export const NaverOAuthConfig = registerAs(
  NAVER_OAUTH_CONFIG,
  (): NaverOAuthConfigReturnType => ({
    clientId: process.env.NAVER_OAUTH_CLIENT_ID,
    clientSecret: process.env.NAVER_OAUTH_CLIENT_SECRET,
    redirectUri: process.env.NAVER_OAUTH_REDIRECT_URI,
    state: process.env.NAVER_OAUTH_STATE,
  }),
);
