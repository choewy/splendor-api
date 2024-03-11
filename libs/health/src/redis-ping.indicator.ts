import { Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicator } from '@nestjs/terminus';
import { Redis } from 'ioredis';

@Injectable()
export class RedisPingIndicator extends HealthIndicator {
  constructor(private readonly redis: Redis) {
    super();
  }

  async pingCheck(key: string) {
    return this.redis
      .ping()
      .then(() => this.getStatus(key, true))
      .catch((e) => {
        throw new HealthCheckError(e.name, e.message);
      });
  }
}
