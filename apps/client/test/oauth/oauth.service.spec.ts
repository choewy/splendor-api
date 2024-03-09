import { CreateGoogleOAuthUrlDto, CreateKakaoOAuthUrlDto, CreateNaverOAuthUrlDto } from '@apps/client/oauth/dtos';
import { OAuthService } from '@apps/client/oauth/services';
import { OAuthPlatform, OAuthRepository } from '@libs/entity';
import { TestingRepository } from '@libs/testing';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

describe(OAuthService.name, () => {
  let module: TestingModule;
  let service: OAuthService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [OAuthService, ConfigService, TestingRepository.mock(OAuthRepository)],
    }).compile();

    service = module.get(OAuthService);
  });

  it('OAuthService가 정의되어 있어야 한다.', () => {
    expect(service).toBeDefined();
  });

  describe('getOAuthAuthorizeUrl', () => {
    beforeAll(() => {
      jest.spyOn(module.get(ConfigService), 'get').mockReturnValue({});
    });

    it('Google OAuth URL을 요청하면 url이 https://accounts.google.com/o/oauth2/v2/auth로 시작하여야 한다.', () => {
      const dto = service.getOAuthAuthorizeUrl(OAuthPlatform.Google);

      expect(dto).toBeInstanceOf(CreateGoogleOAuthUrlDto);
      expect(dto.url.startsWith('https://accounts.google.com/o/oauth2/v2/auth')).toBeTruthy();
    });

    it('Kakao OAuth URL을 요청하면 url이 https://kauth.kakao.com/oauth/authorize로 시작하여야 한다.', () => {
      const dto = service.getOAuthAuthorizeUrl(OAuthPlatform.Kakao);

      expect(dto).toBeInstanceOf(CreateKakaoOAuthUrlDto);
      expect(dto.url.startsWith('https://kauth.kakao.com/oauth/authorize')).toBeTruthy();
    });

    it('Naver OAuth URL을 요청하면 url이 https://nid.naver.com/oauth2.0/authorize로 시작하여야 한다.', () => {
      const dto = service.getOAuthAuthorizeUrl(OAuthPlatform.Naver);

      expect(dto).toBeInstanceOf(CreateNaverOAuthUrlDto);
      expect(dto.url.startsWith('https://nid.naver.com/oauth2.0/authorize')).toBeTruthy();
    });
  });
});
