import { DynamicModule, Module, Provider } from '@nestjs/common';
import { Redis } from 'ioredis';

import { RedisLibsModuleAsyncOptions } from './interfaces';

@Module({})
export class RedisLibsModule {
  static forRootAsync(redisModuleAsyncOptions: RedisLibsModuleAsyncOptions): DynamicModule {
    const redis: Provider = {
      inject: redisModuleAsyncOptions.inject,
      provide: Redis,
      async useFactory(...dependencies) {
        const redisOptions = await redisModuleAsyncOptions.useFactory(...dependencies);
        return new Redis(redisOptions);
      },
    };

    return {
      global: true,
      module: RedisLibsModule,
      providers: [redis],
      exports: [redis],
    };
  }
}
