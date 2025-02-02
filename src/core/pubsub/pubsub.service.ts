import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IoRedis from 'ioredis';

import { RedisConfig } from '../config/redis.config';

@Injectable()
export class PubSubService {
  private readonly redis: IoRedis;

  constructor(private readonly configService: ConfigService) {
    const redisConfig = new RedisConfig(this.configService);
    const redisOptions = redisConfig.getRedisOptions();

    this.redis = new IoRedis(redisOptions);
  }

  async send<T = any>(event: string, payload: T) {
    await this.redis.connect();
    await this.redis.publish(event, JSON.stringify(payload));

    this.redis.disconnect();
  }
}
