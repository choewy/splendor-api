import { ConfigExModule, TypeOrmConfigService } from '@libs/config';
import { DynamicModule, FactoryProvider, Module, Type } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { AbstractRepository } from './abstracts';
import { INJECTABLE_REPOSITORY_METADATA_KEY } from './decorators';

@Module({})
export class TypeOrmExModule {
  static forRoot(): DynamicModule {
    return {
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigExModule.forFeature([TypeOrmConfigService])],
          inject: [TypeOrmConfigService],
          useFactory(typeOrmConfigService: TypeOrmConfigService) {
            return typeOrmConfigService.getTypeOrmOptions();
          },
        }),
      ],
      module: TypeOrmExModule,
    };
  }

  static forFeature<IRepository extends AbstractRepository<any>>(Repositories: Type<IRepository>[]): DynamicModule {
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
      module: TypeOrmExModule,
      providers: repositoryProviders,
      exports: repositoryProviders,
    };
  }
}
