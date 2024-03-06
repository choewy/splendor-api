import { CurrentUserClaim } from '@common/decorators';
import { AlreadyConnectedOAuthPlatformException } from '@common/implements';
import { OAuthEntity, OAuthPlatform } from '@entities/oauth.entity';
import { JwtConfigService, OAuthConfigService } from '@libs/config';
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import Qs from 'qs';

import { GoogleOAuthService } from './google-oauth.service';
import { KakaoOAuthService } from './kakao-oauth.service';
import { NaverOAuthService } from './naver-oauth.service';
import { OAuthAuthorizeUrlDto } from '../dtos';
import { OAuthRepository } from '../repositories';

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
    params: Pick<OAuthEntity, 'platform' | 'oauthId' | 'email' | 'nickname' | 'profileImageUrl'>,
    userId?: number,
  ) {
    const oauth = await this.oauthRepository.findByOAuthId(params.platform, params.oauthId);

    if (oauth) {
      return this.oauthRepository.updateOAuth(oauth, params);
    }

    if (Number.isNaN(userId)) {
      return this.oauthRepository.createOAuthWithUser(params);
    } else {
      return this.oauthRepository.createOAuthIntoUser(userId, params);
    }
  }

  private redirectSignUrl(res: Response, oauth: OAuthEntity) {
    const platform = oauth.platform;
    const claim = CurrentUserClaim.to(oauth.user.id, oauth.platform);
    const access = this.jwtService.sign(claim, this.jwtConfigService.getJwtAccessSignOptions());
    const refresh = this.jwtService.sign(claim, this.jwtConfigService.getJwtRefreshSignOptions());

    return res.redirect(
      HttpStatus.FOUND,
      `${this.oauthConfigService.getRedirectUrl()}?${Qs.stringify({
        platform,
        access,
        refresh,
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
      throw new AlreadyConnectedOAuthPlatformException();
    }

    return this.getOAuthAuthorizeUrl(platform, userId);
  }

  async signWithGoogle(res: Response, code: string, userId?: number) {
    const platform = OAuthPlatform.Google;
    const tokens = await this.googleOAuthService.getTokens(code);
    const accessToken = tokens.access_token;
    const profile = await this.googleOAuthService.getProfileInformation(accessToken);
    const oauth = await this.createOrUpdate(
      {
        platform,
        oauthId: profile.id,
        email: profile.email,
        nickname: profile.name,
        profileImageUrl: profile.picture,
      },
      userId,
    );

    return this.redirectSignUrl(res, oauth);
  }

  async signWithKakao(res: Response, code: string, userId?: number) {
    const platform = OAuthPlatform.Kakao;
    const tokens = await this.kakaoOAuthService.getTokens(code);
    const accessToken = tokens.access_token;
    const tokenInformation = await this.kakaoOAuthService.getTokenInformation(accessToken);
    const profile = await this.kakaoOAuthService.getProfileInformation(accessToken);
    const oauth = await this.createOrUpdate(
      {
        platform,
        oauthId: String(tokenInformation.id),
        email: profile.properties.email,
        nickname: profile.properties.nickname,
        profileImageUrl: profile.properties.profile_image,
      },
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
      {
        platform,
        oauthId: profile.response.id,
        email: profile.response.email,
        nickname: profile.response.nickname,
        profileImageUrl: profile.response.profile_image,
      },
      userId,
    );

    return this.redirectSignUrl(res, oauth);
  }
}
