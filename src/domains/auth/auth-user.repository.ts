import { UserEntity } from '@entities/user.entity';
import { AbstractRepository, InjectableRepository } from '@libs/typeorm';

@InjectableRepository(UserEntity)
export class AuthUserRepository extends AbstractRepository<UserEntity> {
  async findById(id: number) {
    return this.findOne({
      relations: { oauths: true },
      where: { id },
    });
  }
}
