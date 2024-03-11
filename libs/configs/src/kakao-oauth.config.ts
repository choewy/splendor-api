import { registerAs } from '@nestjs/config';

export type KakaoOAuthConfigReturnType = {
  clientId: string;
  redirectUri: string;
};

export const KAKAO_OAUTH_CONFIG = '__kakao_oauth_config__';

export const KakaoOAuthConfig = registerAs(
  KAKAO_OAUTH_CONFIG,
  (): KakaoOAuthConfigReturnType => ({
    clientId: process.env.KAKAO_OAUTH_CLIENT_ID,
    redirectUri: process.env.KAKAO_OAUTH_REDIRECT_URI,
  }),
);
