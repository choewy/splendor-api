import { UserService } from '@apps/client/user/user.service';
import { UserRepository } from '@libs/entity';
import { TestingRepository } from '@libs/testing';
import { Test, TestingModule } from '@nestjs/testing';

describe(UserService.name, () => {
  let module: TestingModule;
  let service: UserService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [UserService, TestingRepository.mock(UserRepository)],
    }).compile();

    service = module.get(UserService);
  });

  it('UserService의 인스턴스가 정의되어 있어야 한다.', () => {
    expect(service).toBeDefined();
  });
});
