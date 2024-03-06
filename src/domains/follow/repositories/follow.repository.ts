import { FollowEntity } from '@entities/follow.entity';
import { AbstractRepository, InjectableRepository } from '@libs/typeorm';

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

  async findManyByFrom(fromId: number, skip: number, take: number) {
    return this.find({
      relations: { to: true },
      where: { from: { id: fromId } },
      skip,
      take,
    });
  }
  async findManyByTo(toId: number, skip: number, take: number) {
    return this.find({
      relations: { from: true },
      where: { to: { id: toId } },
      skip,
      take,
    });
  }
}
