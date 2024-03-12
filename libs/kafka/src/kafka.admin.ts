import { Injectable, OnModuleDestroy, OnModuleInit, Provider } from '@nestjs/common';
import { Admin, AdminConfig, Kafka, KafkaConfig } from 'kafkajs';

import { KafkaLibsModuleAsyncOptions } from './interfaces';
import { KafkaLoggerCreator } from './kafka.logger';

@Injectable()
export class KafkaAdmin implements OnModuleInit, OnModuleDestroy {
  static createProvider(moduleAsyncOptions: KafkaLibsModuleAsyncOptions): Provider {
    return {
      provide: KafkaAdmin,
      inject: [...moduleAsyncOptions.inject],
      async useFactory(...dependencies) {
        const { kafkaOptions, adminOptions } = await moduleAsyncOptions.useFactory(...dependencies);

        return new KafkaAdmin(kafkaOptions, adminOptions);
      },
    };
  }

  private readonly kafka: Kafka;
  private readonly admin: Admin;

  constructor(readonly kafkaConfig: KafkaConfig, readonly adminConfig?: AdminConfig) {
    this.kafkaConfig.logCreator = KafkaLoggerCreator;
    this.kafka = new Kafka(this.kafkaConfig);
    this.admin = this.kafka.admin(this.adminConfig);
  }

  async onModuleInit() {
    await this.admin.connect();
  }

  async onModuleDestroy() {
    await this.admin.disconnect();
  }

  get topics() {
    return this.admin.listTopics;
  }

  get createTopics() {
    return this.admin.createTopics;
  }

  get createPartitions() {
    return this.admin.createPartitions;
  }
}
