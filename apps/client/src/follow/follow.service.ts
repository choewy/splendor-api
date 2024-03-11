import { FollowRepository, UserRepository } from '@libs/entity';
import { Injectable, NotFoundException } from '@nestjs/common';

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
      .where('follow.fromId = :fromId', { fromId })
      .innerJoinAndMapOne('follow.to', 'follow.to', 'user')
      .innerJoinAndMapOne('user.count', 'user.count', 'count')
      .innerJoinAndMapOne('user.studio', 'user.studio', 'studio')
      .innerJoinAndMapOne('studio.studioSetting', 'studio.studioSetting', 'studioSetting')
      .getManyAndCount();

    return new GetFollowingsResultDto(rows, total, userId);
  }

  async getFollowers(userId: number | null, toId: number, query: GetFollowsQuery) {
    await this.validateUserExist(toId);

    const [rows, total] = await this.followRepository
      .createQueryBuilder('follow')
      .skip(query.skip)
      .take(query.take)
      .where('follow.toId = :toId', { toId })
      .innerJoinAndMapOne('follow.from', 'follow.from', 'user')
      .innerJoinAndMapOne('user.count', 'user.count', 'count')
      .innerJoinAndMapOne('user.studio', 'user.studio', 'studio')
      .innerJoinAndMapOne('studio.studioSetting', 'studio.studioSetting', 'studioSetting')
      .getManyAndCount();

    return new GetFollowersResultDto(rows, total, userId);
  }

  async follow(fromId: number, toId: number) {
    await this.validateUserExist(fromId);
    await this.validateUserExist(toId);
  }
}
