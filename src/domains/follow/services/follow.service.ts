import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { FollowRepository, FollowUserRepository } from '../repositories';

@Injectable()
export class FollowService {
  constructor(private readonly followRepository: FollowRepository, private readonly followUserRepository: FollowUserRepository) {}

  /** @todo */
  async getMyFollowings(userId: number) {
    const followings = await this.followRepository.findManyByFrom(userId, 0, 20);

    return followings;
  }

  /** @todo */
  async getMyFollowers(userId: number) {
    const followers = await this.followRepository.findManyByTo(userId, 0, 20);

    return followers;
  }

  async follow(userId: number, toId: number) {
    if (userId === toId) {
      throw new ConflictException('cannot follow your self');
    }

    const exist = await this.followUserRepository.existsById(toId);

    if (exist === false) {
      throw new NotFoundException('not found user');
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
