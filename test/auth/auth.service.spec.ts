import { NotExistUserOAuthException, NotFoundUserException } from '@common/implements';
import { AuthUserRepository } from '@domains/auth/auth-user.repository';
import { AuthService } from '@domains/auth/auth.service';
import { UserEntity } from '@entities/user.entity';
import { ConfigExModule, JwtConfigService } from '@libs/config';
import { AbstractRepository } from '@libs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

describe('AuthService', () => {
  let authModule: TestingModule;
  let authService: AuthService;

  beforeAll(async () => {
    authModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'secret' }), ConfigExModule.forFeature([JwtConfigService])],
      providers: [AbstractRepository.mock(AuthUserRepository), AuthService],
    }).compile();

    authService = authModule.get(AuthService);
  });

  describe('createTokens', () => {
    it('should throw NotFoundException', () => {
      jest.spyOn(authModule.get(JwtConfigService), 'getNodeEnv').mockReturnValue('develop');

      expect(authService.createTokens(1)).rejects.toThrow(new NotFoundException());
    });

    it('should throw NotFoundUserException', () => {
      jest.spyOn(authModule.get(JwtConfigService), 'getNodeEnv').mockReturnValue('local');
      jest.spyOn(authModule.get(AuthUserRepository), 'findById').mockResolvedValue(null);

      expect(authService.createTokens(1)).rejects.toThrow(new NotFoundUserException());
    });

    it('should throw NotExistUserOAuthException', () => {
      jest.spyOn(authModule.get(JwtConfigService), 'getNodeEnv').mockReturnValue('local');
      jest.spyOn(authModule.get(AuthUserRepository), 'findById').mockResolvedValue({ oauths: [] } as UserEntity);

      expect(authService.createTokens(1)).rejects.toThrow(new NotExistUserOAuthException());
    });
  });
});
