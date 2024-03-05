import { OAuthPlatform } from '@entities/oauth.entity';
import { NaverOAuthConfigService } from '@libs/config';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import Qs from 'qs';
import { lastValueFrom } from 'rxjs';

import { GetOAuthTokenInformationError, GetOAuthTokensError } from '../implements';
import { NaverGetTokensResponse, NaverProfileInformationResponse } from '../interfaces';

export enum NaverOAuthApiURL {
  Authorize = 'https://nid.naver.com/oauth2.0/authorize',
  GetTokens = 'https://nid.naver.com/oauth2.0/token',
  GetProfileInformation = 'https://openapi.naver.com/v1/nid/me',
}

@Injectable()
export class NaverOAuthService {
  constructor(private readonly naverOAuthConfigService: NaverOAuthConfigService, private readonly httpService: HttpService) {}

  getAuthorizeUrl(userId?: number): string {
    return `${NaverOAuthApiURL.Authorize}?${Qs.stringify({
      response_type: 'code',
      client_id: this.naverOAuthConfigService.getClientId(),
      redirect_uri: this.naverOAuthConfigService.getRedirectUri(),
      state: userId ?? encodeURI(this.naverOAuthConfigService.getState()),
    })}`;
  }

  async getTokens(code: string, userId?: number): Promise<NaverGetTokensResponse> {
    const { data } = await lastValueFrom(
      this.httpService.get(
        `${NaverOAuthApiURL.GetTokens}?${Qs.stringify({
          code,
          grant_type: 'authorization_code',
          client_id: this.naverOAuthConfigService.getClientId(),
          client_secret: this.naverOAuthConfigService.getClientSecret(),
          state: userId ?? encodeURI(this.naverOAuthConfigService.getState()),
        })}`,
      ),
    ).catch((e) => {
      throw new GetOAuthTokensError(OAuthPlatform.Naver, e);
    });

    return data;
  }

  async getProfileInformation(accessToken: string): Promise<NaverProfileInformationResponse> {
    const { data } = await lastValueFrom(
      this.httpService.get(NaverOAuthApiURL.GetProfileInformation, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    ).catch((e) => {
      throw new GetOAuthTokenInformationError(OAuthPlatform.Naver, e);
    });

    return data;
  }
}
