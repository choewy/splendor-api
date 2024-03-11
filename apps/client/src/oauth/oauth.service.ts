import { GOOGLE_OAUTH_CONFIG, KAKAO_OAUTH_CONFIG, NAVER_OAUTH_CONFIG } from '@libs/configs';
import { OAuthEntity, OAuthPlatform, OAuthRepository, StudioRepository, UserRepository } from '@libs/entity';
import { JwtLibsService } from '@libs/jwt';
import { HttpService } from '@nestjs/axios';
import { ConflictException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import QueryString from 'qs';
import { lastValueFrom } from 'rxjs';
import { v4 } from 'uuid';

import { CreateOAuthUrlCommand, SignWithGoogleCommand, SignWithKakaoCommand, SignWithNaverCommand } from './commands';
import {
  CreateGoogleOAuthUrlDto,
  CreateKakaoOAuthUrlDto,
  CreateNaverOAuthUrlDto,
  GetGoogleOAuthProfileDto,
  GetGoogleOAuthTokensDto,
  GetKakaoOAuthProfileDto,
  GetKakaoOAuthTokensDto,
  GetNaverOAuthProfileDto,
  GetNaverOAuthTokensDto,
  OAuthStateDto,
} from './dtos';
import { OAuthGetProfileError, OAuthGetTokenError, OAuthLog } from './implements';
import {
  GoogleOAuthProfile,
  GoogleOAuthTokens,
  KakaoOAuthProfile,
  KakaoOAuthTokens,
  NaverOAuthProfile,
  NaverOAuthTokens,
  OAuthProfile,
  OAuthServiceImpl,
} from './interfaces';

@Injectable()
export class OAuthService implements OAuthServiceImpl {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly jwtLibsService: JwtLibsService,
    private readonly userRepository: UserRepository,
    private readonly oauthRepository: OAuthRepository,
    private readonly studioRepository: StudioRepository,
  ) {}

  createOAuthUrl(command: CreateOAuthUrlCommand, userId?: number) {
    const state = new OAuthStateDto(command.successUrl, command.failUrl, userId);

    switch (command.platform) {
      case OAuthPlatform.Google:
        return new CreateGoogleOAuthUrlDto(this.configService.get(GOOGLE_OAUTH_CONFIG), state);

      case OAuthPlatform.Kakao:
        return new CreateKakaoOAuthUrlDto(this.configService.get(KAKAO_OAUTH_CONFIG), state);

      case OAuthPlatform.Naver:
        return new CreateNaverOAuthUrlDto(this.configService.get(NAVER_OAUTH_CONFIG), state);
    }
  }

  async getGoogleOAuthToken(code: string): Promise<string> {
    const dto = new GetGoogleOAuthTokensDto(code, this.configService.get(GOOGLE_OAUTH_CONFIG));
    const res = await lastValueFrom(this.httpService.post<GoogleOAuthTokens>(dto.url, dto.body)).catch((e) => {
      throw new OAuthGetTokenError(OAuthPlatform.Google, e);
    });

    return res.data.access_token;
  }

  async getKakaoOAuthToken(code: string): Promise<string> {
    const dto = new GetKakaoOAuthTokensDto(code, this.configService.get(KAKAO_OAUTH_CONFIG));
    const res = await lastValueFrom(this.httpService.post<KakaoOAuthTokens>(dto.url, dto.body, { headers: dto.headers })).catch((e) => {
      throw new OAuthGetTokenError(OAuthPlatform.Kakao, e);
    });

    return res.data.access_token;
  }

  async getNaverOAuthToken(code: string, state: OAuthStateDto): Promise<string> {
    const dto = new GetNaverOAuthTokensDto(code, state, this.configService.get(NAVER_OAUTH_CONFIG));
    const res = await lastValueFrom(this.httpService.get<NaverOAuthTokens>(dto.url)).catch((e) => {
      throw new OAuthGetTokenError(OAuthPlatform.Naver, e);
    });

    return res.data.access_token;
  }

  async getGoogleOAuthProfile(accessToken: string): Promise<OAuthProfile> {
    const dto = new GetGoogleOAuthProfileDto(accessToken);
    const res = await lastValueFrom(this.httpService.get<GoogleOAuthProfile>(dto.url, { headers: dto.headers })).catch((e) => {
      throw new OAuthGetProfileError(OAuthPlatform.Google, e);
    });

    return {
      platform: OAuthPlatform.Google,
      oauthId: res.data.id,
      nickname: res.data.name,
      email: res.data.email,
      profileImageUrl: res.data.picture,
    };
  }

  async getKakaoOAuthProfile(accessToken: string): Promise<OAuthProfile> {
    const dto = new GetKakaoOAuthProfileDto(accessToken);
    const res = await lastValueFrom(this.httpService.get<KakaoOAuthProfile>(dto.url, { headers: dto.headers })).catch((e) => {
      throw new OAuthGetProfileError(OAuthPlatform.Kakao, e);
    });

    return {
      platform: OAuthPlatform.Kakao,
      oauthId: String(res.data.id),
      nickname: res.data.properties.nickname,
      email: res.data.properties.email,
      profileImageUrl: res.data.properties.profile_image,
    };
  }

  async getNaverOAuthProfile(accessToken: string): Promise<OAuthProfile> {
    const dto = new GetNaverOAuthProfileDto(accessToken);
    const res = await lastValueFrom(this.httpService.get<NaverOAuthProfile>(dto.url, { headers: dto.headers })).catch((e) => {
      throw new OAuthGetProfileError(OAuthPlatform.Naver, e);
    });

    return {
      platform: OAuthPlatform.Naver,
      oauthId: res.data.response.id,
      nickname: res.data.response.nickname,
      email: res.data.response.email,
      profileImageUrl: res.data.response.profile_image,
    };
  }

  async getOAuthToken(platform: OAuthPlatform, code: string, state: OAuthStateDto) {
    switch (platform) {
      case OAuthPlatform.Google:
        return this.getGoogleOAuthToken(code);

      case OAuthPlatform.Kakao:
        return this.getKakaoOAuthToken(code);

      case OAuthPlatform.Naver:
        return this.getNaverOAuthToken(code, state);
    }
  }

  async getOAuthProfile(platform: OAuthPlatform, token: string) {
    switch (platform) {
      case OAuthPlatform.Google:
        return this.getGoogleOAuthProfile(token);

      case OAuthPlatform.Kakao:
        return this.getKakaoOAuthProfile(token);

      case OAuthPlatform.Naver:
        return this.getNaverOAuthProfile(token);
    }
  }

  async insertOrUpdateUserOwnOAuth(oauth: OAuthEntity | null, profile: OAuthProfile, userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (user === null) {
      throw new NotFoundException('not found user');
    }

    if (oauth) {
      if (oauth.user.id !== user.id) {
        throw new ConflictException('already connected oauth', {
          cause: {
            platform: oauth.platform,
            oauthId: oauth.oauthId,
            userId: oauth.user.id,
          },
        });
      }

      await this.oauthRepository.update(oauth.id, profile);
    } else {
      await this.oauthRepository.insert({ ...profile, user });
    }

    return user;
  }

  async createStudioUniqueAlias(platform: OAuthPlatform, nickname: string) {
    let loop = 0;
    let exists = true;
    let alias = `${platform.toLowerCase().charAt(0)}_${nickname.toLowerCase()}`.substring(0, 25);

    do {
      exists = await this.studioRepository.exists({
        select: { alias: true },
        where: { alias },
      });

      loop++;

      if (exists) {
        const str = `_${v4().substring(0, loop)}`;
        alias = alias.substring(0, 25 - str.length) + str;
      }
    } while (exists);

    return alias;
  }

  async createUserOrUpdateOAuth(oauth: OAuthEntity | null, profile: OAuthProfile) {
    if (oauth) {
      await this.oauthRepository.update(oauth.id, profile);

      return oauth.user;
    }

    const user = this.userRepository.create({
      nickname: profile.nickname,
      profileImageUrl: profile.profileImageUrl,
      userWallet: {},
      userFollowCount: {},
      oauths: [profile],
      studio: {
        alias: await this.createStudioUniqueAlias(profile.platform, profile.nickname),
        studioPlaySetting: {},
        studioDonationSetting: {},
        alertWidget: {},
        messageWidget: {},
      },
    });

    return user.save();
  }

  async saveOAuth(profile: OAuthProfile, userId?: number) {
    const oauth = await this.oauthRepository.findOne({
      relations: { user: true },
      where: { platform: profile.platform, oauthId: profile.oauthId },
    });

    if (typeof userId === 'number') {
      return this.insertOrUpdateUserOwnOAuth(oauth, profile, userId);
    } else {
      return this.createUserOrUpdateOAuth(oauth, profile);
    }
  }

  async signWithOAuth(
    res: Response,
    platform: OAuthPlatform,
    command: SignWithGoogleCommand | SignWithKakaoCommand | SignWithNaverCommand,
  ) {
    const state = OAuthStateDto.decode(command.state);
    const log = new OAuthLog(platform, state, OAuthService.name, this.signWithOAuth.name);

    try {
      const token = await this.getOAuthToken(platform, command.code, state);
      const profile = await this.getOAuthProfile(platform, token);
      const user = await this.saveOAuth(profile, state.userId);
      const tokens = this.jwtLibsService.createTokens(user.id);

      Logger.verbose(log.toSuccess());

      res.redirect(HttpStatus.FOUND, `${state.successUrl}?${QueryString.stringify(tokens)}`);
    } catch (e) {
      Logger.warn(log.toError(e));

      res.redirect(HttpStatus.FOUND, `${state.failUrl}?${QueryString.stringify({ name: e.name, message: e.message })}`);
    }
  }
}
