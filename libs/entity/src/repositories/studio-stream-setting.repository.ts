import { AbstractRepository, InjectableRepository } from '@libs/typeorm';

import { StudioStreamSettingEntity } from '../entities';

@InjectableRepository(StudioStreamSettingEntity)
export class StudioStreamSettingRepository extends AbstractRepository<StudioStreamSettingEntity> {}
