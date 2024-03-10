import { AuthService } from '@apps/client/auth';
import { CreateTokensCommand } from '@apps/client/auth/command';
import { ClientJwtService, ClientTokensDto } from '@apps/client/jwt';
import { NodeEnv } from '@libs/configs';
import { OAuthEntity, OAuthPlatform, UserEntity, UserRepository } from '@libs/entity';
import { TestingFixture, TestingRepository } from '@libs/testing';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

describe(AuthService.name, () => {
  let module: TestingModule;
  let service: AuthService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [AuthService, TestingRepository.mock(UserRepository), ConfigService, ClientJwtService, JwtService],
    }).compile();

    service = module.get(AuthService);
  });

  it('AuthService의 인스턴스가 정의되어 있어야 한다.', () => {
    expect(service).toBeDefined();
  });

  describe('createTokensWithFindUser', () => {
    const command = TestingFixture.of(CreateTokensCommand, { id: 1, platform: OAuthPlatform.Google });

    beforeAll(() => {
      jest.spyOn(module.get(ClientJwtService), 'createTokens').mockReturnValue(TestingFixture.of(ClientTokensDto));
    });

    it('NODE_ENV가 local이 아닌 경우 NotFoundException을 던진다.', () => {
      jest.spyOn(module.get(ConfigService), 'get').mockReturnValue({ env: NodeEnv.Development });

      expect(service.createTokensWithFindUser(command)).rejects.toBeInstanceOf(NotFoundException);
    });

    it('UserEntity가 존재하지 않는 경우 NotFoundException을 던진다.', () => {
      jest.spyOn(module.get(ConfigService), 'get').mockReturnValue({ env: NodeEnv.Local });
      jest.spyOn(module.get(UserRepository), 'findOne').mockResolvedValue(null);

      expect(service.createTokensWithFindUser(command)).rejects.toBeInstanceOf(NotFoundException);
    });

    it('UserEntity의 OAuthEntity가 하나도 없는 경우 NotFoundException을 던진다.', () => {
      jest.spyOn(module.get(ConfigService), 'get').mockReturnValue({ env: NodeEnv.Local });
      jest.spyOn(module.get(UserRepository), 'findOne').mockResolvedValue(TestingFixture.of(UserEntity, { oauths: [] }));

      expect(service.createTokensWithFindUser(command)).rejects.toBeInstanceOf(NotFoundException);
    });

    it('UserEntity의 OAuthEntity 중에 CreateTokensCommand의 platform과 일치하는 OAuthEntity가 없는 경우 NotFoundException을 던진다.', () => {
      jest.spyOn(module.get(ConfigService), 'get').mockReturnValue({ env: NodeEnv.Local });
      jest
        .spyOn(module.get(UserRepository), 'findOne')
        .mockResolvedValue(TestingFixture.of(UserEntity, { oauths: [TestingFixture.of(OAuthEntity, { platform: OAuthPlatform.Kakao })] }));

      expect(service.createTokensWithFindUser(command)).rejects.toBeInstanceOf(NotFoundException);
    });

    it('토큰 생성에 성공하면 ClientTokensDto를 반환한다.', () => {
      jest.spyOn(module.get(ConfigService), 'get').mockReturnValue({ env: NodeEnv.Local });
      jest
        .spyOn(module.get(UserRepository), 'findOne')
        .mockResolvedValue(TestingFixture.of(UserEntity, { oauths: [TestingFixture.of(OAuthEntity, { platform: OAuthPlatform.Google })] }));

      expect(service.createTokensWithFindUser(command)).resolves.toBeInstanceOf(ClientTokensDto);
    });
  });
});
