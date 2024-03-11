import { AbstractRepository, InjectableRepository } from '@libs/typeorm';

import { FollowEntity } from '../entities';

@InjectableRepository(FollowEntity)
export class FollowRepository extends AbstractRepository<FollowEntity> {}
