import { CurrentUserClaim } from '@common/decorators';
import { OAuthEntity, OAuthPlatform } from '@entities/oauth.entity';
import { JwtConfigService, OAuthConfigService } from '@libs/config';
import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
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

  private async createOrUpdate(
    platform: OAuthPlatform,
    oauthId: string,
    email: string | null,
    nickname: string,
    profileImageUrl: string | null,
    userId?: number,
  ) {
    let oauth = await this.oauthRepository.findByOAuthId(platform, oauthId);

    if (oauth) {
      oauth = await this.oauthRepository.updateOAuth(oauth, {
        email,
        nickname,
        profileImageUrl,
      });
    } else {
      oauth = await this.oauthRepository.createOAuth({
        platform,
        oauthId,
        email,
        nickname,
        profileImageUrl,
        user: { id: Number.isNaN(userId) ? undefined : userId },
      });
    }

    return oauth;
  }

  private redirectSignUrl(res: Response, oauth: OAuthEntity) {
    const platform = oauth.platform;
    const accessToken = this.jwtService.sign(CurrentUserClaim.to(oauth.user.id, oauth.platform), this.jwtConfigService.getJwtSignOptions());

    return res.redirect(
      HttpStatus.FOUND,
      `${this.oauthConfigService.getRedirectUrl()}?${Qs.stringify({
        platform,
        accessToken,
      })}`,
    );
  }

  getOAuthAuthorizeUrl(platform: OAuthPlatform, userId?: number) {
    let url: string;

    switch (platform) {
      case OAuthPlatform.Google:
        url = this.googleOAuthService.getAuthorizeUrl(userId);
        break;

      case OAuthPlatform.Kakao:
        url = this.kakaoOAuthService.getAuthorizeUrl(userId);
        break;

      case OAuthPlatform.Naver:
        url = this.naverOAuthService.getAuthorizeUrl(userId);
        break;
    }

    return new OAuthAuthorizeUrlDto(platform, url);
  }

  async connectOAuthAccount(userId: number, platform: OAuthPlatform) {
    const has = await this.oauthRepository.existsBy({ platform, user: { id: userId } });

    if (has) {
      throw new ConflictException(`already connected ${platform}`);
    }

    return this.getOAuthAuthorizeUrl(platform);
  }

  async signWithGoogle(res: Response, code: string, userId?: number) {
    const platform = OAuthPlatform.Google;
    const tokens = await this.googleOAuthService.getTokens(code);
    const accessToken = tokens.access_token;
    const profile = await this.googleOAuthService.getProfileInformation(accessToken);
    const oauth = await this.createOrUpdate(platform, profile.id, profile.email, profile.name, profile.picture, userId);

    return this.redirectSignUrl(res, oauth);
  }

  async signWithKakao(res: Response, code: string, userId?: number) {
    const platform = OAuthPlatform.Kakao;
    const tokens = await this.kakaoOAuthService.getTokens(code);
    const accessToken = tokens.access_token;
    const tokenInformation = await this.kakaoOAuthService.getTokenInformation(accessToken);
    const profile = await this.kakaoOAuthService.getProfileInformation(accessToken);
    const oauth = await this.createOrUpdate(
      platform,
      String(tokenInformation.id),
      profile.properties.email,
      profile.properties.nickname,
      profile.properties.profile_image,
      userId,
    );

    return this.redirectSignUrl(res, oauth);
  }

  async signWithNaver(res: Response, code: string, userId?: number) {
    const platform = OAuthPlatform.Naver;
    const tokens = await this.naverOAuthService.getTokens(code);
    const accessToken = tokens.access_token;
    const profile = await this.naverOAuthService.getProfileInformation(accessToken);
    const oauth = await this.createOrUpdate(
      platform,
      profile.response.id,
      profile.response.email,
      profile.response.nickname,
      profile.response.profile_image,
      userId,
    );

    return this.redirectSignUrl(res, oauth);
  }
}
