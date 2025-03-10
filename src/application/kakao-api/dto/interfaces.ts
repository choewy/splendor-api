export interface KakaoGetTokenResponse {
  token_type: 'bearer';
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_token_expires_in: number;
}

export interface KakaoGetUserResponse {
  id: number;
  connected_at: string;
  properties: {
    nickname: string;
    profile_image: string;
    thumbnail_image: string;
  };
  kakao_account: {
    profile_nickname_needs_agreement: boolean;
    profile_image_needs_agreement: boolean;
    profile: {
      nickname: string;
      thumbnail_image_url: string;
      profile_image_url: string;
      is_default_image: boolean;
      is_default_nickname: boolean;
    };
  };
}
