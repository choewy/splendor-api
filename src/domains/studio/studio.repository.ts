import { StudioEntity } from '@entities/studio.entity';
import { AbstractRepository, InjectableRepository } from '@libs/typeorm';

@InjectableRepository(StudioEntity)
export class StudioRepository extends AbstractRepository<StudioEntity> {}
