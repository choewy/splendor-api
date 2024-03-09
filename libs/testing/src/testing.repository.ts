import { AbstractRepository } from '@libs/typeorm';
import { FactoryProvider, Type } from '@nestjs/common';
import { Repository } from 'typeorm';

export class TestingRepository {
  static mock(TargetRepository: Type<AbstractRepository<any>>): FactoryProvider {
    const methods = []
      .concat(Object.getOwnPropertyNames(Object.getPrototypeOf(new Repository(null, null))))
      .concat(Object.getOwnPropertyNames(Object.getPrototypeOf(new AbstractRepository(null, null))))
      .concat(Object.getOwnPropertyNames(Object.getPrototypeOf(new TargetRepository())));

    return {
      provide: TargetRepository,
      useFactory() {
        const mock = {};

        for (const method of methods) {
          mock[method] = () => null;
        }

        return mock;
      },
    };
  }
}
