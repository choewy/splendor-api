import { OAuthPlatform } from '@entities/oauth.entity';
import { KakaoOAuthConfigService } from '@libs/config';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import Qs from 'qs';
import { lastValueFrom } from 'rxjs';

import { GetOAuthProfileInformationError, GetOAuthTokenInformationError, GetOAuthTokensError } from '../implements';
import { KakaoGetProfileInformationResponse, KakaoGetTokenInformationResponse, KakaoGetTokensResponse } from '../interfaces';

export enum KakaoOAuthApiURL {
  Authorize = 'https://kauth.kakao.com/oauth/authorize',
  GetTokens = 'https://kauth.kakao.com/oauth/token',
  GetTokenInformation = 'https://kapi.kakao.com/v1/user/access_token_info',
  GetProfileInformation = 'https://kapi.kakao.com/v2/user/me?secure_resource=true',
}

@Injectable()
export class KakaoOAuthService {
  constructor(private readonly kakaoOAuthConfigService: KakaoOAuthConfigService, private readonly httpService: HttpService) {}

  getAuthorizeUrl(): string {
    return `${KakaoOAuthApiURL.Authorize}?${Qs.stringify({
      response_type: 'code',
      client_id: this.kakaoOAuthConfigService.getClientId(),
      redirect_uri: this.kakaoOAuthConfigService.getRedirectUri(),
    })}`;
  }

  async getTokens(code: string): Promise<KakaoGetTokensResponse> {
    const { data } = await lastValueFrom(
      this.httpService.post(
        KakaoOAuthApiURL.GetTokens,
        {
          grant_type: 'authorization_code',
          client_id: this.kakaoOAuthConfigService.getClientId(),
          redirect_uri: this.kakaoOAuthConfigService.getRedirectUri(),
          code,
        },
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' } },
      ),
    ).catch((e) => {
      throw new GetOAuthTokensError(OAuthPlatform.Kakao, e);
    });

    return data;
  }

  async getTokenInformation(kakaoAccessToken: string): Promise<KakaoGetTokenInformationResponse> {
    const { data } = await lastValueFrom(
      this.httpService.get(KakaoOAuthApiURL.GetTokenInformation, {
        headers: { Authorization: `Bearer ${kakaoAccessToken}` },
      }),
    ).catch((e) => {
      throw new GetOAuthTokenInformationError(OAuthPlatform.Kakao, e);
    });

    return data;
  }

  async getProfileInformation(kakaoAccessToken: string): Promise<KakaoGetProfileInformationResponse> {
    const { data } = await lastValueFrom(
      this.httpService.get(KakaoOAuthApiURL.GetProfileInformation, {
        headers: { Authorization: `Bearer ${kakaoAccessToken}` },
      }),
    ).catch((e) => {
      throw new GetOAuthProfileInformationError(OAuthPlatform.Kakao, e);
    });

    return data;
  }
}
