import { DynamicModule, Module, Type } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AbstractConfigService } from './abstracts';

@Module({})
export class ConfigExModule {
  static forRoot(): DynamicModule {
    return {
      imports: [ConfigModule.forRoot()],
      module: ConfigExModule,
      global: true,
    };
  }

  static forFeature(services: Type<AbstractConfigService>[], opt?: { global: boolean }): DynamicModule {
    return {
      module: ConfigExModule,
      providers: services,
      exports: services,
      global: opt?.global,
    };
  }
}
