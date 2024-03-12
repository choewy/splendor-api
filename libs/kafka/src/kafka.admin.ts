import { Injectable, Logger, OnModuleInit, Provider } from '@nestjs/common';
import { Admin, AdminConfig, Kafka, KafkaConfig } from 'kafkajs';

import { KafkaLibsModuleAsyncOptions } from './interfaces';
import { KafkaLoggerCreator } from './kafka.logger';

@Injectable()
export class KafkaAdmin implements OnModuleInit {
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

  private readonly logger = new Logger(KafkaAdmin.name);
  private readonly kafka: Kafka;
  private readonly admin: Admin;

  constructor(clientConfig: KafkaConfig, adminConfig?: AdminConfig) {
    this.kafka = new Kafka({ ...clientConfig, logCreator: KafkaLoggerCreator });
    this.admin = this.kafka.admin(adminConfig);
  }

  async onModuleInit() {
    await this.admin.connect();
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
