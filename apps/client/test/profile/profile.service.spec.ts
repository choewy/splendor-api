import { ProfileDto } from '@apps/client/profile/dtos';
import { ProfileService } from '@apps/client/profile/profile.service';
import { UserEntity, UserRepository } from '@libs/entity';
import { TestingFixture, TestingRepository } from '@libs/testing';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe(ProfileService.name, () => {
  let module: TestingModule;
  let service: ProfileService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [ProfileService, TestingRepository.mock(UserRepository)],
    }).compile();

    service = module.get(ProfileService);
  });

  it('ProfileService의 인스턴스가 정의되어 있어야 한다.', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    it('회원 정보가 존재하지 않으면 NotFoundException을 던진다.', () => {
      jest.spyOn(module.get(UserRepository), 'findOne').mockResolvedValue(null);

      expect(service.getProfile(1)).rejects.toBeInstanceOf(NotFoundException);
    });

    it('회원 정보가 존재하면 ProfileDto를 반환한다.', () => {
      jest.spyOn(module.get(UserRepository), 'findOne').mockResolvedValue(TestingFixture.of(UserEntity));

      expect(service.getProfile(1)).resolves.toBeInstanceOf(ProfileDto);
    });
  });
});
