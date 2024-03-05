export interface NaverGetTokensResponse {
  token_type: 'bearer';
  access_token: string;
  refresh_token: string;
  expires_in: number;
  error?: string;
  error_description?: string;
}

export interface NaverProfileInformationResponse {
  resultcode: string;
  message: string;
  response: {
    id: string;
    email: string;
    nickname: string;
    profile_image: string;
    age: string;
    gender: 'M' | 'F';
    name: string;
    birthday: string;
    birthyear: string;
    mobile: string;
  };
}
