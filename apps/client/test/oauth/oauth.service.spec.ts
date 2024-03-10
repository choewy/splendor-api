import { ClientJwtService, ClientTokensDto } from '@apps/client/jwt';
import { CreateOAuthUrlCommand, SignWithGoogleCommand } from '@apps/client/oauth/commands';
import { CreateGoogleOAuthUrlDto, CreateKakaoOAuthUrlDto, CreateNaverOAuthUrlDto, OAuthStateDto } from '@apps/client/oauth/dtos';
import { OAuthGetProfileError, OAuthGetTokenError } from '@apps/client/oauth/implements';
import { OAuthProfile } from '@apps/client/oauth/interfaces';
import { OAuthService } from '@apps/client/oauth/oauth.service';
import { OAuthEntity, OAuthPlatform, OAuthRepository, UserEntity, UserRepository } from '@libs/entity';
import { TestingFixture, TestingRepository } from '@libs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConflictException, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';

describe(OAuthService.name, () => {
  let module: TestingModule;
  let service: OAuthService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        OAuthService,
        TestingRepository.mock(UserRepository),
        TestingRepository.mock(OAuthRepository),
        ConfigService,
        ClientJwtService,
        JwtService,
        Logger,
      ],
    }).compile();

    service = module.get(OAuthService);
  });

  it('OAuthService가 정의되어 있어야 한다.', () => {
    expect(service).toBeDefined();
  });

  describe('createOAuthUrl', () => {
    beforeAll(() => {
      jest.spyOn(module.get(ConfigService), 'get').mockReturnValue({});
    });

    it('Google OAuth URL을 요청하면 url이 https://accounts.google.com/o/oauth2/v2/auth로 시작하여야 한다.', () => {
      const dto = service.createOAuthUrl(TestingFixture.of(CreateOAuthUrlCommand, { platform: OAuthPlatform.Google }));

      expect(dto).toBeInstanceOf(CreateGoogleOAuthUrlDto);
      expect(dto.url.startsWith('https://accounts.google.com/o/oauth2/v2/auth')).toBeTruthy();
    });

    it('Kakao OAuth URL을 요청하면 url이 https://kauth.kakao.com/oauth/authorize로 시작하여야 한다.', () => {
      const dto = service.createOAuthUrl(TestingFixture.of(CreateOAuthUrlCommand, { platform: OAuthPlatform.Kakao }));

      expect(dto).toBeInstanceOf(CreateKakaoOAuthUrlDto);
      expect(dto.url.startsWith('https://kauth.kakao.com/oauth/authorize')).toBeTruthy();
    });

    it('Naver OAuth URL을 요청하면 url이 https://nid.naver.com/oauth2.0/authorize로 시작하여야 한다.', () => {
      const dto = service.createOAuthUrl(TestingFixture.of(CreateOAuthUrlCommand, { platform: OAuthPlatform.Naver }));

      expect(dto).toBeInstanceOf(CreateNaverOAuthUrlDto);
      expect(dto.url.startsWith('https://nid.naver.com/oauth2.0/authorize')).toBeTruthy();
    });
  });

  describe('getOAuthToken', () => {
    const state = TestingFixture.of(OAuthStateDto);

    let getGoogleOAuthToken: jest.SpyInstance<Promise<string>, [code: string]>;
    let getKakaoOAuthToken: jest.SpyInstance<Promise<string>, [code: string]>;
    let getNaverOAuthToken: jest.SpyInstance<Promise<string>, [code: string, state: OAuthStateDto]>;

    beforeEach(() => {
      if (getGoogleOAuthToken) {
        getGoogleOAuthToken.mockClear();
      }

      if (getKakaoOAuthToken) {
        getKakaoOAuthToken.mockClear();
      }

      if (getNaverOAuthToken) {
        getNaverOAuthToken.mockClear();
      }

      getGoogleOAuthToken = jest.spyOn(service, 'getGoogleOAuthToken').mockResolvedValue('');
      getKakaoOAuthToken = jest.spyOn(service, 'getKakaoOAuthToken').mockResolvedValue('');
      getNaverOAuthToken = jest.spyOn(service, 'getNaverOAuthToken').mockResolvedValue('');
    });

    it('platform이 google인 경우 Google OAuth Token만 요청해야 한다.', async () => {
      await service.getOAuthToken(OAuthPlatform.Google, '', state);

      expect(getGoogleOAuthToken).toHaveBeenCalledTimes(1);
      expect(getKakaoOAuthToken).toHaveBeenCalledTimes(0);
      expect(getNaverOAuthToken).toHaveBeenCalledTimes(0);
    });

    it('platform이 kakao인 경우 Kakao OAuth Token만 요청해야 한다.', async () => {
      await service.getOAuthToken(OAuthPlatform.Kakao, '', state);

      expect(getGoogleOAuthToken).toHaveBeenCalledTimes(0);
      expect(getKakaoOAuthToken).toHaveBeenCalledTimes(1);
      expect(getNaverOAuthToken).toHaveBeenCalledTimes(0);
    });

    it('platform이 naver인 경우 Naver OAuth Token만 요청해야 한다.', async () => {
      await service.getOAuthToken(OAuthPlatform.Naver, '', state);

      expect(getGoogleOAuthToken).toHaveBeenCalledTimes(0);
      expect(getKakaoOAuthToken).toHaveBeenCalledTimes(0);
      expect(getNaverOAuthToken).toHaveBeenCalledTimes(1);
    });
  });

  describe('getOAuthProfile', () => {
    let getGoogleOAuthProfile: jest.SpyInstance<Promise<OAuthProfile>, [token: string]>;
    let getKakaoOAuthProfile: jest.SpyInstance<Promise<OAuthProfile>, [token: string]>;
    let getNaverOAuthProfile: jest.SpyInstance<Promise<OAuthProfile>, [token: string]>;

    beforeEach(() => {
      if (getGoogleOAuthProfile) {
        getGoogleOAuthProfile.mockClear();
      }

      if (getKakaoOAuthProfile) {
        getKakaoOAuthProfile.mockClear();
      }

      if (getNaverOAuthProfile) {
        getNaverOAuthProfile.mockClear();
      }

      getGoogleOAuthProfile = jest.spyOn(service, 'getGoogleOAuthProfile').mockResolvedValue(TestingFixture.of(OAuthEntity));
      getKakaoOAuthProfile = jest.spyOn(service, 'getKakaoOAuthProfile').mockResolvedValue(TestingFixture.of(OAuthEntity));
      getNaverOAuthProfile = jest.spyOn(service, 'getNaverOAuthProfile').mockResolvedValue(TestingFixture.of(OAuthEntity));
    });

    it('platform이 google인 경우 Google OAuth Profile만 요청해야 한다.', async () => {
      await service.getOAuthProfile(OAuthPlatform.Google, '');

      expect(getGoogleOAuthProfile).toHaveBeenCalledTimes(1);
      expect(getKakaoOAuthProfile).toHaveBeenCalledTimes(0);
      expect(getNaverOAuthProfile).toHaveBeenCalledTimes(0);
    });

    it('platform이 kakao인 경우 Kakao OAuth Profile만 요청해야 한다.', async () => {
      await service.getOAuthProfile(OAuthPlatform.Kakao, '');

      expect(getGoogleOAuthProfile).toHaveBeenCalledTimes(0);
      expect(getKakaoOAuthProfile).toHaveBeenCalledTimes(1);
      expect(getNaverOAuthProfile).toHaveBeenCalledTimes(0);
    });

    it('platform이 naver인 경우 Naver OAuth Profile만 요청해야 한다.', async () => {
      await service.getOAuthProfile(OAuthPlatform.Naver, '');

      expect(getGoogleOAuthProfile).toHaveBeenCalledTimes(0);
      expect(getKakaoOAuthProfile).toHaveBeenCalledTimes(0);
      expect(getNaverOAuthProfile).toHaveBeenCalledTimes(1);
    });
  });

  describe('insertOrUpdateUserOwnOAuth', () => {
    beforeEach(() => {
      const oauthRepositoryInsert = jest
        .spyOn(module.get(OAuthRepository), 'insert')
        .mockResolvedValue({ generatedMaps: [], raw: {}, identifiers: [] });

      const oauthRepositoryUpdate = jest
        .spyOn(module.get(OAuthRepository), 'update')
        .mockResolvedValue({ generatedMaps: [], raw: {}, affected: 1 });

      oauthRepositoryInsert.mockClear();
      oauthRepositoryUpdate.mockClear();
    });

    it('userId로 조회한 UserEntity가 없는 경우 NotFouneException을 던진다.', () => {
      const profile = TestingFixture.of(OAuthEntity);
      const user = null;

      jest.spyOn(module.get(UserRepository), 'findOneBy').mockResolvedValue(user);

      expect(service.insertOrUpdateUserOwnOAuth(null, profile, 1)).rejects.toBeInstanceOf(NotFoundException);
    });

    it('OAuthEntity가 이미 존재하나, OAuthEntity의 userId와 요청자의 userId가 서로 다른 경우 ConflictException을 던진다.', () => {
      const existingOAuth = TestingFixture.of(OAuthEntity, { user: TestingFixture.of(UserEntity, { id: 2 }) });
      const profile = TestingFixture.of(OAuthEntity);
      const user = TestingFixture.of(UserEntity, { id: 1 });

      jest.spyOn(module.get(UserRepository), 'findOneBy').mockResolvedValue(user);

      expect(service.insertOrUpdateUserOwnOAuth(existingOAuth, profile, 1)).rejects.toBeInstanceOf(ConflictException);
    });

    it('OAuthEntity가 이미 존재하고, OAuthEntity의 userId와 요청자의 userId가 같은 경우 OAuthEntity를 최신 OAuthProfile 정보로 수정한다.', async () => {
      const existingOAuth = TestingFixture.of(OAuthEntity, { id: 1, user: TestingFixture.of(UserEntity, { id: 1 }) });
      const profile = TestingFixture.of(OAuthEntity);
      const user = TestingFixture.of(UserEntity, { id: 1 });

      jest.spyOn(module.get(UserRepository), 'findOneBy').mockResolvedValue(user);

      const result = await service.insertOrUpdateUserOwnOAuth(existingOAuth, profile, 1);

      expect(result).toBeInstanceOf(UserEntity);
      expect(module.get(OAuthRepository).update).toHaveBeenCalledTimes(1);
      expect(module.get(OAuthRepository).update).toHaveBeenCalledWith(1, profile);
    });

    it('OAuthEntity가 존재하지 않는 경우, 요청자의 userId에 OAuthEntity를 추가한다.', async () => {
      const user = TestingFixture.of(UserEntity, { id: 1 });
      const profile = TestingFixture.of(OAuthEntity);

      jest.spyOn(module.get(UserRepository), 'findOneBy').mockResolvedValue(user);

      const result = await service.insertOrUpdateUserOwnOAuth(null, profile, 1);

      expect(result).toBeInstanceOf(UserEntity);
      expect(module.get(OAuthRepository).insert).toHaveBeenCalledTimes(1);
      expect(module.get(OAuthRepository).insert).toHaveBeenCalledWith({ ...profile, user });
    });
  });

  describe('createUserOrUpdateOAuth', () => {
    const profile = TestingFixture.of(OAuthEntity);

    beforeEach(() => {
      const oauthRepositoryUpdate = jest
        .spyOn(module.get(OAuthRepository), 'update')
        .mockResolvedValue({ affected: 1, raw: {}, generatedMaps: [] });

      oauthRepositoryUpdate.mockClear();
    });

    it('OAuthEntity가 이미 존재하는 경우 OAuthEntity를 OAuthProfile 정보로 수정한다.', async () => {
      const existingOAuth = TestingFixture.of(OAuthEntity, { id: 1, user: TestingFixture.of(UserEntity) });
      const result = await service.createUserOrUpdateOAuth(existingOAuth, profile);

      jest.spyOn(module.get(UserRepository), 'create').mockReturnValue(TestingFixture.of(UserEntity));

      expect(result).toBeInstanceOf(UserEntity);
      expect(module.get(UserRepository).create).toHaveBeenCalledTimes(0);
      expect(module.get(OAuthRepository).update).toHaveBeenCalledTimes(1);
      expect(module.get(OAuthRepository).update).toHaveBeenCalledWith(1, profile);
    });

    it('OAuthEntity가 존재하지 않는 경우 OAuthProfile로 UserEntity를 생성한다.', async () => {
      const existingOAuth = null;
      const user = TestingFixture.of(UserEntity);

      jest.spyOn(module.get(UserRepository), 'create').mockReturnValue(user);
      jest.spyOn(user, 'save').mockResolvedValue(user);

      const result = await service.createUserOrUpdateOAuth(existingOAuth, profile);

      expect(result).toBeInstanceOf(UserEntity);
      expect(user.save).toHaveBeenCalledTimes(1);
      expect(module.get(UserRepository).create).toHaveBeenCalledTimes(1);
      expect(module.get(OAuthRepository).update).toHaveBeenCalledTimes(0);
    });
  });

  describe('saveOAuth', () => {
    const profile = TestingFixture.of(OAuthEntity);

    beforeEach(() => {
      jest.spyOn(module.get(OAuthRepository), 'findOne').mockResolvedValue(null);

      const insertOrUpdateUserOwnOAuth = jest.spyOn(service, 'insertOrUpdateUserOwnOAuth').mockResolvedValue(TestingFixture.of(UserEntity));
      const createUserOrUpdateOAuth = jest.spyOn(service, 'createUserOrUpdateOAuth').mockResolvedValue(TestingFixture.of(UserEntity));

      insertOrUpdateUserOwnOAuth.mockClear();
      createUserOrUpdateOAuth.mockClear();
    });

    it('OAuth 플랫폼으로부터 state로 넘겨받은 userId가 number 타입인 경우 insertOrUpdateUserOwnOAuth를 호출한다.', async () => {
      await service.saveOAuth(profile, 1);

      expect(service.insertOrUpdateUserOwnOAuth).toHaveBeenCalledTimes(1);
      expect(service.createUserOrUpdateOAuth).toHaveBeenCalledTimes(0);
    });

    it('OAuth 플랫폼으로부터 state로 넘겨받은 userId가 number 타입이 아닌 경우 createUserOrUpdateOAuth를 호출한다.', async () => {
      await service.saveOAuth(profile);

      expect(service.insertOrUpdateUserOwnOAuth).toHaveBeenCalledTimes(0);
      expect(service.createUserOrUpdateOAuth).toHaveBeenCalledTimes(1);
    });
  });

  describe('signWithOAuth', () => {
    const res = { redirect: () => undefined } as unknown as Response;
    const platform = OAuthPlatform.Google;
    const command = TestingFixture.of(SignWithGoogleCommand, { state: TestingFixture.of(OAuthStateDto).encode() });

    beforeAll(() => {
      jest.spyOn(module.get(ClientJwtService), 'createTokens').mockReturnValue(TestingFixture.of(ClientTokensDto));
    });

    beforeEach(() => {
      const loggerVerbose = jest.spyOn(Logger, 'verbose').mockReturnValue();
      const loggerWarn = jest.spyOn(Logger, 'warn').mockReturnValue();

      loggerVerbose.mockClear();
      loggerWarn.mockClear();
    });

    it('OAuth 토큰을 가져오는데 실패하면 실패 로그가 기록되어야 한다.', async () => {
      jest.spyOn(service, 'getOAuthToken').mockRejectedValue(new OAuthGetTokenError(platform, new Error()));

      await service.signWithOAuth(res, platform, command);

      expect(Logger.verbose).toHaveBeenCalledTimes(0);
      expect(Logger.warn).toHaveBeenCalledTimes(1);
    });

    it('OAuth 프로필 정보를 가져오는데 실패하면 실패 로그가 기록되어야 한다.', async () => {
      jest.spyOn(service, 'getOAuthToken').mockResolvedValue('');
      jest.spyOn(service, 'getOAuthProfile').mockRejectedValue(new OAuthGetProfileError(platform, new Error()));

      await service.signWithOAuth(res, platform, command);

      expect(Logger.verbose).toHaveBeenCalledTimes(0);
      expect(Logger.warn).toHaveBeenCalledTimes(1);
    });

    it('OAuthEntity를 생성 및 수정하는 과정에 오류가 발생하면 warn 로그가 기록되어야 한다.', async () => {
      jest.spyOn(service, 'getOAuthToken').mockResolvedValue('');
      jest.spyOn(service, 'getOAuthProfile').mockResolvedValue(TestingFixture.of(OAuthEntity));
      jest.spyOn(service, 'saveOAuth').mockRejectedValue(new ConflictException());

      await service.signWithOAuth(res, platform, command);

      expect(Logger.verbose).toHaveBeenCalledTimes(0);
      expect(Logger.warn).toHaveBeenCalledTimes(1);
    });

    it('OAuth 토큰 발급, OAuth 프로필 조회, OAuthEntity 생성 및 수정이 정상적으로 수행되었다면 verbose 로그가 기록되어야 한다.', async () => {
      jest.spyOn(service, 'getOAuthToken').mockResolvedValue('');
      jest.spyOn(service, 'getOAuthProfile').mockResolvedValue(TestingFixture.of(OAuthEntity));
      jest.spyOn(service, 'saveOAuth').mockResolvedValue(TestingFixture.of(UserEntity));

      await service.signWithOAuth(res, platform, command);

      expect(Logger.verbose).toHaveBeenCalledTimes(1);
      expect(Logger.warn).toHaveBeenCalledTimes(0);
    });
  });
});
