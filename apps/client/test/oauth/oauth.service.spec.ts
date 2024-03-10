import { ClientJwtService } from '@apps/client/jwt';
import { CreateOAuthUrlCommand } from '@apps/client/oauth/commands';
import { CreateGoogleOAuthUrlDto, CreateKakaoOAuthUrlDto, CreateNaverOAuthUrlDto, OAuthStateDto } from '@apps/client/oauth/dtos';
import { OAuthProfile } from '@apps/client/oauth/interfaces';
import { OAuthService } from '@apps/client/oauth/oauth.service';
import { OAuthEntity, OAuthPlatform, OAuthRepository, UserEntity, UserRepository } from '@libs/entity';
import { TestingFixture, TestingRepository } from '@libs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

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
});
