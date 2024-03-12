import { FollowEntity, FollowRepository, UserFollowCountEntity, UserRepository } from '@libs/entity';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { GetFollowersResultDto, GetFollowingsResultDto } from './dtos';
import { GetFollowsQuery } from './queries';

@Injectable()
export class FollowService {
  constructor(private readonly userRepository: UserRepository, private readonly followRepository: FollowRepository) {}

  async validateUserExist(userId: number) {
    const existsUser = await this.userRepository.existsBy({ id: userId });

    if (existsUser === false) {
      throw new NotFoundException('not found user');
    }
  }

  async getFollowings(userId: number | null, fromId: number, query: GetFollowsQuery) {
    await this.validateUserExist(fromId);

    const [rows, total] = await this.followRepository
      .createQueryBuilder('follow')
      .skip(query.skip)
      .take(query.take)
      .where('follow.userId = :fromId', { fromId })
      .innerJoinAndMapOne('follow.target', 'follow.target', 'user')
      .innerJoinAndMapOne('user.userFollowCount', 'user.userFollowCount', 'userFollowCount')
      .innerJoinAndMapOne('user.studio', 'user.studio', 'studio')
      .getManyAndCount();

    return new GetFollowingsResultDto(rows, total, userId);
  }

  async getFollowers(userId: number | null, targetId: number, query: GetFollowsQuery) {
    await this.validateUserExist(targetId);

    const [rows, total] = await this.followRepository
      .createQueryBuilder('follow')
      .skip(query.skip)
      .take(query.take)
      .where('follow.targetId = :targetId', { targetId })
      .innerJoinAndMapOne('follow.user', 'follow.user', 'user')
      .innerJoinAndMapOne('user.userFollowCount', 'user.userFollowCount', 'userFollowCount')
      .innerJoinAndMapOne('user.studio', 'user.studio', 'studio')
      .getManyAndCount();

    return new GetFollowersResultDto(rows, total, userId);
  }

  async follow(userId: number, targetId: number) {
    if (userId === targetId) {
      throw new ConflictException('cannot follow/unfollow your self');
    }

    await this.validateUserExist(targetId);

    const existsFollow = await this.followRepository.existsBy({ userId, targetId });

    if (existsFollow === true) {
      return;
    }

    await this.followRepository.transaction(async (em) => {
      const followRepository = em.getRepository(FollowEntity);
      await followRepository.insert({ userId, targetId });

      const userFollowCountRepository = em.getRepository(UserFollowCountEntity);
      await userFollowCountRepository
        .createQueryBuilder()
        .update()
        .set({ followings: () => 'followings + 1' })
        .where({ userId: userId })
        .execute();

      await userFollowCountRepository
        .createQueryBuilder()
        .update()
        .set({ followers: () => 'followers + 1' })
        .where({ userId: targetId })
        .execute();
    });
  }

  async unfollow(userId: number, targetId: number) {
    if (userId === targetId) {
      throw new ConflictException('cannot follow/unfollow your self');
    }

    await this.validateUserExist(targetId);

    const existsFollow = await this.followRepository.existsBy({ userId, targetId });

    if (existsFollow === false) {
      return;
    }

    await this.followRepository.transaction(async (em) => {
      const followRepository = em.getRepository(FollowEntity);
      await followRepository.delete({ userId, targetId });

      const userFollowCountRepository = em.getRepository(UserFollowCountEntity);
      await userFollowCountRepository
        .createQueryBuilder()
        .update()
        .set({ followings: () => 'IF(followings = 0, 0, followings - 1)' })
        .where({ userId: userId })
        .execute();

      await userFollowCountRepository
        .createQueryBuilder()
        .update()
        .set({ followers: () => 'IF(followers = 0, 0, followers - 1)' })
        .where({ userId: targetId })
        .execute();
    });
  }
}
