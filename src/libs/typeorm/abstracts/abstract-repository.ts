import { FactoryProvider, Type } from '@nestjs/common';
import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm';

export abstract class AbstractRepository<E extends ObjectLiteral> extends Repository<E> {
  static mock<AbstractMockRepository extends AbstractRepository<any>>(MockRepository: Type<AbstractMockRepository>): FactoryProvider {
    return {
      provide: MockRepository,
      useFactory() {
        const repository = new MockRepository(null);
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(repository));
        const mock = {};

        for (const method of methods) {
          mock[method] = () => null;
        }

        return mock as AbstractMockRepository;
      },
    };
  }

  constructor(readonly target: EntityTarget<E>, readonly dataSource: DataSource) {
    super(target, dataSource?.createEntityManager());
  }

  get transaction() {
    return this.dataSource.transaction;
  }
}
