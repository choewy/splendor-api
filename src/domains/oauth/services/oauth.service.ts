import { OAuthEntity, OAuthPlatform } from '@entities/oauth.entity';
import { JwtConfigService, OAuthConfigService } from '@libs/config';
import { PassportJwtPayload } from '@libs/passport';
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import Qs from 'qs';

import { GoogleOAuthService } from './google-oauth.service';
import { KakaoOAuthService } from './kakao-oauth.service';
import { NaverOAuthService } from './naver-oauth.service';
import { OAuthAuthorizeUrlDto } from '../dtos';
import { OAuthRepository } from '../oauth.repository';

@Injectable()
export class OAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtConfigService: JwtConfigService,
    private readonly oauthRepository: OAuthRepository,
    private readonly oauthConfigService: OAuthConfigService,
    private readonly googleOAuthService: GoogleOAuthService,
    private readonly kakaoOAuthService: KakaoOAuthService,
    private readonly naverOAuthService: NaverOAuthService,
  ) {}

  private redirectSignUrl(res: Response, oauth: OAuthEntity) {
    const platform = oauth.platform;
    const accessToken = this.jwtService.sign(
      {
        platform,
        userId: oauth.user.id,
        nickname: oauth.user.nickname,
      } as PassportJwtPayload,
      this.jwtConfigService.getJwtSignOptions(),
    );

    return res.redirect(
      HttpStatus.FOUND,
      `${this.oauthConfigService.getRedirectUrl()}?${Qs.stringify({
        platform,
        accessToken,
      })}`,
    );
  }

  getOAuthAuthorizeUrl(platform: OAuthPlatform) {
    let url: string;

    switch (platform) {
      case OAuthPlatform.Google:
        url = this.googleOAuthService.getAuthorizeUrl();
        break;

      case OAuthPlatform.Kakao:
        url = this.kakaoOAuthService.getAuthorizeUrl();
        break;

      case OAuthPlatform.Naver:
        url = this.naverOAuthService.getAuthorizeUrl();
        break;
    }

    return new OAuthAuthorizeUrlDto(platform, url);
  }

  async signWithKakao(res: Response, code: string) {
    const platform = OAuthPlatform.Kakao;
    const kakaoTokens = await this.kakaoOAuthService.getTokens(code);
    const kakaoAccessToken = kakaoTokens.access_token;
    const kakaoTokenInformation = await this.kakaoOAuthService.getTokenInformation(kakaoAccessToken);
    const oauthId = String(kakaoTokenInformation.id);

    let oauth = await this.oauthRepository.findByOAuthId(platform, oauthId);

    if (oauth === null) {
      const kakaoProfile = await this.kakaoOAuthService.getProfileInformation(kakaoAccessToken);
      const profileImageUrl = kakaoProfile.properties.profile_image;
      const nickname = kakaoProfile.properties.nickname;

      oauth = await this.oauthRepository.createOAuth({
        platform,
        oauthId,
        email: null,
        profileImageUrl,
        user: { nickname },
      });
    }

    return this.redirectSignUrl(res, oauth);
  }
}
