import { AbstractRepository, InjectableRepository } from '@libs/typeorm';

import { StudioEntity } from '../entities';

@InjectableRepository(StudioEntity)
export class StudioRepository extends AbstractRepository<StudioEntity> {}
