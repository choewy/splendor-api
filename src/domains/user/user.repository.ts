import { UserEntity } from '@entities/user.entity';
import { AbstractRepository, InjectableRepository } from '@libs/typeorm';

@InjectableRepository(UserEntity)
export class UserRepository extends AbstractRepository<UserEntity> {}
