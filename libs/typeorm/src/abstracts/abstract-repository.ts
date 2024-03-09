import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm';

export class AbstractRepository<E extends ObjectLiteral> extends Repository<E> {
  constructor(readonly target: EntityTarget<E>, readonly dataSource: DataSource) {
    super(target, dataSource?.createEntityManager());
  }

  get transaction() {
    return this.dataSource.transaction;
  }
}
