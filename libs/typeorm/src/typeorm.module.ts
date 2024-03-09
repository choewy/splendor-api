import { DynamicModule, FactoryProvider, Module, Type } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { AbstractRepository } from './abstracts';
import { INJECTABLE_REPOSITORY_METADATA_KEY } from './decorators';

@Module({})
export class TypeOrmLibsModule {
  static forRoot(options: TypeOrmModuleOptions): DynamicModule {
    return {
      imports: [TypeOrmModule.forRoot(options)],
      module: TypeOrmLibsModule,
    };
  }

  static forRootAsync(options: TypeOrmModuleAsyncOptions): DynamicModule {
    return {
      imports: [TypeOrmModule.forRootAsync(options)],
      module: TypeOrmLibsModule,
    };
  }

  static forFeature(Repositories: Type<AbstractRepository<any>>[]): DynamicModule {
    const repositoryProviders: FactoryProvider[] = [];

    for (const Repository of Repositories) {
      repositoryProviders.push({
        inject: [DataSource],
        provide: Repository,
        useFactory(dataSource: DataSource) {
          const target = Reflect.getMetadata(INJECTABLE_REPOSITORY_METADATA_KEY, Repository);

          return new Repository(target, dataSource);
        },
      });
    }

    return {
      module: TypeOrmLibsModule,
      providers: repositoryProviders,
      exports: repositoryProviders,
    };
  }
}
