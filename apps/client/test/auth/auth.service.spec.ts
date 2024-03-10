import { AuthService } from '@apps/client/auth';
import { ClientJwtService } from '@apps/client/jwt';
import { UserRepository } from '@libs/entity';
import { TestingRepository } from '@libs/testing';
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
});
