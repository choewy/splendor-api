export interface KakaoGetTokensResponse {
  token_type: 'bearer';
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_token_expires_in: number;
}

export interface KakaoGetTokenInformationResponse {
  id: number;
  expires_in: number;
  app_id: number;
}

export interface KakaoGetProfileInformationResponse {
  id: number;
  properties: {
    nickname: string;
    profile_image: string;
    thumbnail_image: string;
  };
  kakao_account: {
    profile: {
      nickname: string;
      thumbnail_image_url: string;
      profile_image_url: string;
      is_default_image: boolean;
    };
    profile_nickname_needs_agreement: boolean;
    profile_image_needs_agreement: boolean;
  };
  connected_at: string;
}
