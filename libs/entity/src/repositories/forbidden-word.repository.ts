import { AbstractRepository, InjectableRepository } from '@libs/typeorm';

import { ForbiddenWordEntity } from '../entities';

@InjectableRepository(ForbiddenWordEntity)
export class ForbiddenWordRepository extends AbstractRepository<ForbiddenWordEntity> {}
