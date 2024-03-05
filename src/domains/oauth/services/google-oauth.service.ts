import { GoogleOAuthConfigService } from '@libs/config';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import Qs from 'qs';
import { lastValueFrom } from 'rxjs';
import { GetOAuthProfileInformationError, GetOAuthTokensError } from '../implements';
import { OAuthPlatform } from '@entities/oauth.entity';
import { GoogleGetTokensResponse, GoogleProfileInformationResponse } from '../interfaces';

export enum GoogleOAuthApiURL {
  Authorize = 'https://accounts.google.com/o/oauth2/v2/auth',
  GetTokens = 'https://oauth2.googleapis.com/token',
  GetProfileInformation = 'https://www.googleapis.com/userinfo/v2/me',
}

@Injectable()
export class GoogleOAuthService {
  constructor(private readonly googleOAuthConfigService: GoogleOAuthConfigService, private readonly httpService: HttpService) {}

  getAuthorizeUrl(): string {
    return `${GoogleOAuthApiURL.Authorize}?${Qs.stringify({
      response_type: 'code',
      client_id: this.googleOAuthConfigService.getClientId(),
      redirect_uri: this.googleOAuthConfigService.getRedirectUri(),
      scope: 'email profile',
    })}`;
  }

  async getTokens(code: string): Promise<GoogleGetTokensResponse> {
    const { data } = await lastValueFrom(
      this.httpService.post(GoogleOAuthApiURL.GetTokens, {
        code,
        grant_type: 'authorization_code',
        client_id: this.googleOAuthConfigService.getClientId(),
        client_secret: this.googleOAuthConfigService.getClientSecret(),
        redirect_uri: this.googleOAuthConfigService.getRedirectUri(),
      }),
    ).catch((e) => {
      throw new GetOAuthTokensError(OAuthPlatform.Google, e);
    });

    return data;
  }

  async getProfileInformation(accessToken: string): Promise<GoogleProfileInformationResponse> {
    const { data } = await lastValueFrom(
      this.httpService.get(GoogleOAuthApiURL.GetProfileInformation, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    ).catch((e) => {
      throw new GetOAuthProfileInformationError(OAuthPlatform.Google, e);
    });

    return data;
  }
}
