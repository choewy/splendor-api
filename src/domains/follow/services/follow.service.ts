import { CannotFollowYourSelfException, NotFoundUserException } from '@common/implements';
import { Injectable } from '@nestjs/common';

import { FollowerDto, FollowerPaginationDto, FollowingDto, FollowingPaginationDto, GetFollowsDto } from '../dtos';
import { FollowRepository, FollowUserRepository } from '../repositories';

@Injectable()
export class FollowService {
  constructor(private readonly followRepository: FollowRepository, private readonly followUserRepository: FollowUserRepository) {}

  async getMyFollowings(userId: number, params: GetFollowsDto) {
    const [followings, total] = await this.followRepository.findManyByFromId(userId, params.skip, params.take, params.nickname);

    return new FollowingPaginationDto(
      followings.map((following) => new FollowingDto(following)),
      total,
    );
  }

  async getMyFollowers(userId: number, params: GetFollowsDto) {
    const [followers, total] = await this.followRepository.findManyByToId(userId, params.skip, params.take, params.nickname);

    return new FollowerPaginationDto(
      followers.map((follower) => new FollowerDto(follower)),
      total,
    );
  }

  async follow(userId: number, toId: number) {
    if (userId === toId) {
      throw new CannotFollowYourSelfException();
    }

    const exist = await this.followUserRepository.existsById(toId);

    if (exist === false) {
      throw new NotFoundUserException();
    }

    const has = await this.followRepository.existsByIds(userId, toId);

    if (has === false) {
      await this.followRepository.insertByIds(userId, toId);
    }
  }

  async unfollow(userId: number, toId: number) {
    await this.followRepository.deleteByIds(userId, toId);
  }
}
