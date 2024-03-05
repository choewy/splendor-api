import { Injectable } from '@nestjs/common';
import { DiskHealthIndicator, HealthCheck, HealthCheckService, MemoryHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';

import { HttpPingIndicator } from './indicators';

@Injectable()
export class HealthService {
  constructor(
    private readonly httpPingIndicator: HttpPingIndicator,
    private readonly healthCheckService: HealthCheckService,
    private readonly typeOrmHealthIndicator: TypeOrmHealthIndicator,
    private readonly memoryHealthIndicator: MemoryHealthIndicator,
    private readonly diskHealthIndicator: DiskHealthIndicator,
  ) {}

  @HealthCheck({ swaggerDocumentation: true })
  async check() {
    return this.healthCheckService.check([
      () => this.httpPingIndicator.pingCheck('nestjs-docs', 'https://nestjs.com/'),
      () => this.typeOrmHealthIndicator.pingCheck('database', { timeout: 15000 }),
      () => this.memoryHealthIndicator.checkHeap('memory_heap', 1000 * 1024 * 1024),
      () => this.memoryHealthIndicator.checkRSS('memory_RSS', 1000 * 1024 * 1024),
      () => this.diskHealthIndicator.checkStorage('disk_health', { thresholdPercent: 10, path: '/' }),
    ]);
  }
}
