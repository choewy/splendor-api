import { ClientJwtService } from '@apps/client/jwt';
import { CreateOAuthUrlCommand } from '@apps/client/oauth/commands';
import { CreateGoogleOAuthUrlDto, CreateKakaoOAuthUrlDto, CreateNaverOAuthUrlDto, OAuthStateDto } from '@apps/client/oauth/dtos';
import { OAuthService } from '@apps/client/oauth/oauth.service';
import { OAuthPlatform, OAuthRepository, UserRepository } from '@libs/entity';
import { TestingFixture, TestingRepository } from '@libs/testing';
import { HttpModule, HttpService } from '@nestjs/axios';
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
});
