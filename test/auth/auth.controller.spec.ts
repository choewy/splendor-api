import { AuthUserRepository } from '@domains/auth/auth-user.repository';
import { AuthController } from '@domains/auth/auth.controller';
import { AuthService } from '@domains/auth/auth.service';
import { UserEntity } from '@entities/user.entity';
import { ConfigExModule, JwtConfigService } from '@libs/config';
import { AbstractRepository } from '@libs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

describe('AuthController', () => {
  let authModule: TestingModule;
  let authController: AuthController;

  beforeAll(async () => {
    authModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'secret' }), ConfigExModule.forFeature([JwtConfigService])],
      controllers: [AuthController],
      providers: [AbstractRepository.mock(AuthUserRepository), AuthService],
    }).compile();

    authController = authModule.get(AuthController);
  });

  describe('create Tokens', () => {
    it('should throw ForbiddenException', () => {
      jest.spyOn(authModule.get(JwtConfigService), 'getNodeEnv').mockReturnValue('develop');

      expect(authController.createTokens({ id: 1 })).rejects.toThrow(new ForbiddenException());
    });

    it('should throw NotFoundException(not found user)', () => {
      jest.spyOn(authModule.get(JwtConfigService), 'getNodeEnv').mockReturnValue('local');
      jest.spyOn(authModule.get(AuthUserRepository), 'findById').mockResolvedValue(null);

      expect(authController.createTokens({ id: 1 })).rejects.toThrow(new NotFoundException('not found user'));
    });

    it('should throw NotFoundException(not exist user oauth)', () => {
      jest.spyOn(authModule.get(JwtConfigService), 'getNodeEnv').mockReturnValue('local');
      jest.spyOn(authModule.get(AuthUserRepository), 'findById').mockResolvedValue({ oauths: [] } as UserEntity);

      expect(authController.createTokens({ id: 1 })).rejects.toThrow(new NotFoundException('not exist user oauth'));
    });
  });
});
