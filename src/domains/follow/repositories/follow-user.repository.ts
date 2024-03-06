import { UserEntity } from '@entities/user.entity';
import { AbstractRepository, InjectableRepository } from '@libs/typeorm';

@InjectableRepository(UserEntity)
export class FollowUserRepository extends AbstractRepository<UserEntity> {
  async existsById(id: number) {
    return this.existsBy({ id });
  }
}
