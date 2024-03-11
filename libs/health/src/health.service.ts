import { Injectable } from '@nestjs/common';
import { DiskHealthIndicator, HealthCheck, HealthCheckService, MemoryHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';

import { HttpPingIndicator } from './http-ping.indicator';
import { RedisPingIndicator } from './redis-ping.indicator';

@Injectable()
export class HealthService {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly diskHealthIndicator: DiskHealthIndicator,
    private readonly memoryHealthIndicator: MemoryHealthIndicator,
    private readonly typeOrmHealthIndicator: TypeOrmHealthIndicator,
    private readonly httpPingIndicator: HttpPingIndicator,
    private readonly redisPingIndicator: RedisPingIndicator,
  ) {}

  @HealthCheck({ swaggerDocumentation: true })
  async check() {
    return this.healthCheckService.check([
      () => this.diskHealthIndicator.checkStorage('disk_health', { thresholdPercent: 10, path: '/' }),
      () => this.memoryHealthIndicator.checkHeap('memory_heap', 1000 * 1024 * 1024),
      () => this.memoryHealthIndicator.checkRSS('memory_RSS', 1000 * 1024 * 1024),
      () => this.typeOrmHealthIndicator.pingCheck('database', { timeout: 15000 }),
      () => this.httpPingIndicator.pingCheck('nestjs-docs', 'https://nestjs.com/'),
      () => this.redisPingIndicator.pingCheck('redis'),
    ]);
  }
}
