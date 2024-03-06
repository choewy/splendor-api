import { CannotFollowYourSelfException, NotFoundUserException } from '@common/implements';
import { FollowRepository, FollowUserRepository } from '@domains/follow/repositories';
import { FollowService } from '@domains/follow/services';
import { AbstractRepository } from '@libs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

describe('FollowService', () => {
  let followModule: TestingModule;
  let followService: FollowService;

  beforeAll(async () => {
    followModule = await Test.createTestingModule({
      providers: [AbstractRepository.mock(FollowRepository), AbstractRepository.mock(FollowUserRepository), FollowService],
    }).compile();

    followService = followModule.get(FollowService);
  });

  describe('follow', () => {
    it('should throw CannotFollowYourSelfException', () => {
      expect(() => followService.follow(1, 1)).rejects.toThrow(new CannotFollowYourSelfException());
    });

    it('should throw NotFoundUserException', () => {
      jest.spyOn(followModule.get(FollowUserRepository), 'existsById').mockResolvedValue(false);

      expect(() => followService.follow(1, 2)).rejects.toThrow(new NotFoundUserException());
    });
  });
});
