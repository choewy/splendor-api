import { AbstractRepository, InjectableRepository } from '@libs/typeorm';

import { StudioDonationSettingEntity } from '../entities';

@InjectableRepository(StudioDonationSettingEntity)
export class StudioDonationSettingRepository extends AbstractRepository<StudioDonationSettingEntity> {}
