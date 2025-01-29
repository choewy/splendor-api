import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as qs from 'qs';
import { lastValueFrom } from 'rxjs';
import { OAuthPlatform } from 'src/domain/enums';

import { KakaoGetTokenResponse, KakaoGetUserResponse } from './dto/interfaces';
import { KakaoLoginCallbackQueryParamDTO } from './dto/kakao-login-callback-query-param.dto';
import { KakaoGetTokenFailedException, KakaoGetUserFailedException } from './exception/kakao-login-failed.exception';
import { OAuthService } from '../oauth/oauth.service';

@Injectable()
export class KakaoApiService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly oAuthService: OAuthService,
  ) {}

  private get clientId() {
    return this.configService.getOrThrow('KAKAO_REST_API_KEY');
  }

  private get redirectUri() {
    return this.configService.getOrThrow('KAKAO_LOGIN_REDIRECT_URI');
  }

  async redirectLoginPage(response: Response) {
    const redirectUrl = `https://kauth.kakao.com/oauth/authorize?${qs.stringify({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
    })}`;

    response.redirect(redirectUrl);
  }

  async callbackKakaoLogin(response: Response, queryParam: KakaoLoginCallbackQueryParamDTO) {
    const kakaoToken = await this.getToken(queryParam.code);
    const kakaoUser = await this.getUser(kakaoToken.access_token);

    await this.oAuthService.signWithOAuth(
      response,
      OAuthPlatform.Kakao,
      kakaoUser.id,
      kakaoUser.kakao_account.profile.nickname,
      undefined,
      kakaoUser.kakao_account.profile.profile_image_url,
    );
  }

  async getToken(code: string) {
    const { data } = await lastValueFrom(
      this.httpService.post<KakaoGetTokenResponse>(
        'https://kauth.kakao.com/oauth/token',
        {
          grant_type: 'authorization_code',
          client_id: this.clientId,
          redirect_uri: this.redirectUri,
          code,
        },
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' } },
      ),
    ).catch((e) => {
      throw new KakaoGetTokenFailedException(e?.response?.data);
    });

    return data;
  }

  async getUser(accessToken: string) {
    const { data } = await lastValueFrom(
      this.httpService.get<KakaoGetUserResponse>('https://kapi.kakao.com/v2/user/me', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          property_keys: ['kakao_account.profile', 'kakao_account.name', 'kakao_account.email'],
        },
      }),
    ).catch((e) => {
      throw new KakaoGetUserFailedException(e?.response?.data);
    });

    return data;
  }
}
