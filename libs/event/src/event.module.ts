import { DynamicModule, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { EventService } from './event.service';

@Module({})
export class EventModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: EventModule,
      imports: [EventEmitterModule.forRoot()],
      providers: [EventService],
      exports: [EventService],
    };
  }
}
