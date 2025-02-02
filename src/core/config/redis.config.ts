import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisOptions } from 'ioredis';

@Injectable()
export class RedisConfig {
  constructor(private readonly configService: ConfigService) {}

  public getRedisOptions(): RedisOptions {
    return {
      host: this.configService.getOrThrow('REDIS_HOST'),
      port: this.configService.getOrThrow('REDIS_PORT'),
      db: this.configService.getOrThrow('REDIS_DB'),
      lazyConnect: true,
    };
  }
}
