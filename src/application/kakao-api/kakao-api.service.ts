import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as qs from 'qs';
import { lastValueFrom } from 'rxjs';
import { OAuthPlatform } from 'src/domain/enums';

import { KakaoGetTokenResponse, KakaoGetUserResponse } from './dto/interfaces';
import { KakaoGetTokenFailedException, KakaoGetUserFailedException } from './exception/kakao-login-failed.exception';
import { OAuthService } from '../oauth/oauth.service';
import { GetKakaoLoginPageURIParamDTO } from './dto/get-kakao-login-uri-param.dto';
import { KakaoLoginURIDTO } from './dto/kakao-login-uri.dto';
import { LoginWithKakoDTO } from './dto/login-with-kakao.dto';

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

  async getKakaoLoginURI(queryParam: GetKakaoLoginPageURIParamDTO) {
    return new KakaoLoginURIDTO(
      `https://kauth.kakao.com/oauth/authorize?${qs.stringify({
        response_type: 'code',
        client_id: this.clientId,
        redirect_uri: queryParam.redirectUri,
      })}`,
    );
  }

  private async getKakaoToken(code: string, redirectUri: string) {
    const { data } = await lastValueFrom(
      this.httpService.post<KakaoGetTokenResponse>(
        'https://kauth.kakao.com/oauth/token',
        {
          grant_type: 'authorization_code',
          client_id: this.clientId,
          redirect_uri: redirectUri,
          code,
        },
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' } },
      ),
    ).catch((e) => {
      throw new KakaoGetTokenFailedException(e?.response?.data);
    });

    return data;
  }

  private async getKakaoUser(accessToken: string) {
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

  async loginWithKakao(body: LoginWithKakoDTO) {
    const kakaoToken = await this.getKakaoToken(body.code, body.redirectUri);
    const kakaoUser = await this.getKakaoUser(kakaoToken.access_token);

    return this.oAuthService.signWithOAuth(
      OAuthPlatform.Kakao,
      kakaoUser.id,
      kakaoUser.kakao_account.profile.nickname,
      undefined,
      kakaoUser.kakao_account.profile.profile_image_url,
    );
  }
}
