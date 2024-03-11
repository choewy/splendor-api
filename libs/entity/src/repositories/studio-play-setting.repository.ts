import { AbstractRepository, InjectableRepository } from '@libs/typeorm';

import { StudioPlaySettingEntity } from '../entities';

@InjectableRepository(StudioPlaySettingEntity)
export class StudioPlaySettingRepository extends AbstractRepository<StudioPlaySettingEntity> {}
