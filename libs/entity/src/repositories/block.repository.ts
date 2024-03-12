import { AbstractRepository, InjectableRepository } from '@libs/typeorm';

import { BlockEntity } from '../entities';

@InjectableRepository(BlockEntity)
export class BlockRepository extends AbstractRepository<BlockEntity> {}
