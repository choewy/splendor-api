import { FollowEntity } from '@entities/follow.entity';
import { AbstractRepository, InjectableRepository } from '@libs/typeorm';
import { Like } from 'typeorm';

@InjectableRepository(FollowEntity)
export class FollowRepository extends AbstractRepository<FollowEntity> {
  async existsByIds(fromId: number, toId: number) {
    return this.existsBy({
      from: { id: fromId },
      to: { id: toId },
    });
  }

  async insertByIds(fromId: number, toId: number) {
    return this.insert({
      from: { id: fromId },
      to: { id: toId },
    });
  }

  async deleteByIds(fromId: number, toId: number) {
    return this.delete({
      from: { id: fromId },
      to: { id: toId },
    });
  }

  async findManyByFromId(fromId: number, skip: number, take: number, nickname?: string) {
    return this.findAndCount({
      relations: { to: true },
      where: {
        from: { id: fromId },
        to: { nickname: nickname ? Like(nickname) : undefined },
      },
      skip,
      take,
    });
  }

  async findManyByToId(toId: number, skip: number, take: number, nickname?: string) {
    return this.findAndCount({
      relations: { from: true },
      where: {
        to: { id: toId },
        from: { nickname: nickname ? Like(nickname) : undefined },
      },
      skip,
      take,
    });
  }
}
