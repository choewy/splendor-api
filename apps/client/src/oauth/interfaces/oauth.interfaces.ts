import { OAuthEntity } from '@libs/entity';

import { OAuthStateDto } from '../dtos';

export type OAuthProfile = Pick<OAuthEntity, 'oauthId' | 'platform' | 'nickname' | 'email' | 'profileImageUrl'>;
export type GetOAuthTokenFunction = (code: string, state?: OAuthStateDto) => Promise<string>;
export type GetOAuthProfileFunction = (accessToken: string) => Promise<OAuthProfile>;

export interface OAuthServiceImpl {
  getGoogleOAuthToken: GetOAuthTokenFunction;
  getGoogleOAuthProfile: GetOAuthProfileFunction;
  getKakaoOAuthToken: GetOAuthTokenFunction;
  getKakaoOAuthProfile: GetOAuthProfileFunction;
  getNaverOAuthToken: GetOAuthTokenFunction;
  getNaverOAuthProfile: GetOAuthProfileFunction;
}
