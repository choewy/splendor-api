import { AbstractRepository, InjectableRepository } from '@libs/typeorm';

import { UserEntity } from '../entities';

@InjectableRepository(UserEntity)
export class UserRepository extends AbstractRepository<UserEntity> {}
