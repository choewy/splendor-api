export interface GoogleGetTokensResponse {
  token_type: 'Bearer';
  access_token: string;
  refresh_token: string;
  scope: string;
  expires_in: number;
}

export interface GoogleProfileInformationResponse {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}
