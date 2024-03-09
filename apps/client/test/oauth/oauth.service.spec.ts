import { AuthService } from '@apps/client/auth';
import { CreateOAuthUrlCommand } from '@apps/client/oauth/commands';
import { CreateGoogleOAuthUrlDto, CreateKakaoOAuthUrlDto, CreateNaverOAuthUrlDto } from '@apps/client/oauth/dtos';
import { OAuthService } from '@apps/client/oauth/services';
import { OAuthPlatform, OAuthRepository, UserRepository } from '@libs/entity';
import { TestingFixture, TestingRepository } from '@libs/testing';
import { HttpModule } from '@nestjs/axios';
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
        AuthService,
        OAuthService,
        ConfigService,
        JwtService,
        TestingRepository.mock(UserRepository),
        TestingRepository.mock(OAuthRepository),
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
});
