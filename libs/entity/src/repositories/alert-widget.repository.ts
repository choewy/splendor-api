import { AbstractRepository, InjectableRepository } from '@libs/typeorm';

import { AlertWidgetEntity } from '../entities';

@InjectableRepository(AlertWidgetEntity)
export class AlertWidgetRepository extends AbstractRepository<AlertWidgetEntity> {}
