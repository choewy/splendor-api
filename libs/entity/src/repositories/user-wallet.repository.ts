import { AbstractRepository, InjectableRepository } from '@libs/typeorm';

import { UserWalletEntity } from '../entities';

@InjectableRepository(UserWalletEntity)
export class UserWalletRepository extends AbstractRepository<UserWalletEntity> {}
