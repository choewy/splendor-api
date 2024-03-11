import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { HttpPingIndicator } from './http-ping.indicator';
import { RedisPingIndicator } from './redis-ping.indicator';

@Module({})
export class HealthLibsModule {
  static register(): DynamicModule {
    return {
      imports: [TerminusModule, HttpModule],
      controllers: [HealthController],
      providers: [HealthService, HttpPingIndicator, RedisPingIndicator],
      module: HealthLibsModule,
    };
  }
}
