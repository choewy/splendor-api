import { AbstractRepository, InjectableRepository } from '@libs/typeorm';

import { OAuthEntity } from '../entities';

@InjectableRepository(OAuthEntity)
export class OAuthRepository extends AbstractRepository<OAuthEntity> {}
