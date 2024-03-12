import { DynamicModule, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { KafkaLibsModuleAsyncOptions } from './interfaces';
import { KafkaAdmin } from './kafka.admin';
import { KafkaConsumer } from './kafka.consumer';
import { KafkaProducer } from './kafka.producer';

@Module({})
export class KafkaLibsModule {
  static registerAsync(moduleAsyncOptions: KafkaLibsModuleAsyncOptions): DynamicModule {
    const admin = KafkaAdmin.createProvider(moduleAsyncOptions);
    const producer = KafkaProducer.createProvider(moduleAsyncOptions);
    const consumer = KafkaConsumer.createProvider(moduleAsyncOptions);

    return {
      global: true,
      module: KafkaLibsModule,
      imports: [EventEmitterModule.forRoot()],
      providers: [admin, producer, consumer],
      exports: [admin, producer, consumer],
    };
  }
}
