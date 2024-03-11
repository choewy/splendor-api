import { DynamicModule, Module } from '@nestjs/common';

import { RedisLibsModuleAsyncOptions } from './interfaces';
import { RedisLibsService } from './redis.service';

@Module({})
export class RedisLibsModule {
  static forRootAsync(redisModuleAsyncOptions: RedisLibsModuleAsyncOptions): DynamicModule {
    const redisLibService = RedisLibsService.createProvider(redisModuleAsyncOptions);

    return {
      global: true,
      module: RedisLibsModule,
      providers: [redisLibService],
      exports: [redisLibService],
    };
  }
}
