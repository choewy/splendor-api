import { FactoryProvider, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

import { RedisLibsModuleAsyncOptions } from './interfaces';

@Injectable()
export class RedisLibsService extends Redis {
  static createProvider(redisModuleAsyncOptions: RedisLibsModuleAsyncOptions): FactoryProvider {
    return {
      inject: [...redisModuleAsyncOptions.inject],
      provide: RedisLibsService,
      async useFactory(...dependencies) {
        const redisOptions = await redisModuleAsyncOptions.useFactory(...dependencies);
        return new RedisLibsService(redisOptions);
      },
    };
  }
}
