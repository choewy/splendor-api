import { UserRepository } from '@libs/entity';
import { Injectable } from '@nestjs/common';

import { SearchUsersResultDto } from './dtos';
import { SearchUsersQuery } from './queries';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async seaerchUsers(userId: number | null, query: SearchUsersQuery) {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .skip(query.skip)
      .take(query.take)
      .where('1')
      .innerJoinAndMapOne('user.studio', 'user.studio', 'studio')
      .innerJoinAndMapOne('studio.studioSetting', 'studio.studioSetting', 'studioSetting');

    if (userId) {
      queryBuilder
        .andWhere('user.id != :userId', { userId })
        .leftJoinAndMapOne('user.following', 'user.followers', 'following', 'following.fromId = :userId AND following.toId = user.id', {
          userId,
        });
    }

    if (query.nickname) {
      queryBuilder.andWhere(`user.nickname LIKE %${query.nickname}%`);
    }

    const [rows, total] = await queryBuilder.getManyAndCount();

    return new SearchUsersResultDto(rows, total);
  }
}
