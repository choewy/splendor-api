import { AbstractRepository, InjectableRepository } from '@libs/typeorm';

import { DonationEntity } from '../entities';

@InjectableRepository(DonationEntity)
export class DonationRepository extends AbstractRepository<DonationEntity> {}
