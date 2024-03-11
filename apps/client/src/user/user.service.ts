import { UserRepository } from '@libs/entity';
import { Injectable } from '@nestjs/common';
import { Not } from 'typeorm';

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
      .leftJoinAndMapOne('user.userFollowCount', 'user.userFollowCount', 'userFollowCount')
      .innerJoinAndMapOne('user.studio', 'user.studio', 'studio')
      .innerJoinAndMapOne('studio.studioSetting', 'studio.studioSetting', 'studioSetting');

    if (userId) {
      queryBuilder
        .andWhere({ id: Not(userId) })
        .leftJoinAndMapOne('user.followed', 'user.followers', 'followed', 'followed.fromId = :userId AND followed.toId = user.id', {
          userId,
        });
    }

    if (query.nickname) {
      queryBuilder.andWhere(`BINARY(user.nickname) LIKE "%${query.nickname}%"`);
    }

    const [rows, total] = await queryBuilder.getManyAndCount();

    return new SearchUsersResultDto(rows, total);
  }
}
