import { Injectable, Logger, OnModuleDestroy, OnModuleInit, Provider } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Kafka, EachMessagePayload, Consumer, KafkaConfig, ConsumerConfig } from 'kafkajs';

import { KafkaMessageEvent, KafkaMessagePayload } from './implements';
import { KafkaLibsModuleAsyncOptions } from './interfaces';
import { KafkaLoggerCreator } from './kafka.logger';

@Injectable()
export class KafkaConsumer implements OnModuleInit, OnModuleDestroy {
  static createProvider(moduleAsyncOptions: KafkaLibsModuleAsyncOptions): Provider {
    return {
      provide: KafkaConsumer,
      inject: [EventEmitter2, ...moduleAsyncOptions.inject],
      async useFactory(eventEmitter: EventEmitter2, ...dependencies) {
        const { kafkaOptions, consumerOptions } = await moduleAsyncOptions.useFactory(...dependencies);

        return new KafkaConsumer(eventEmitter, kafkaOptions, consumerOptions);
      },
    };
  }

  private readonly logger = new Logger(KafkaConsumer.name);
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly kafkaConfig: KafkaConfig,
    private readonly consumerConfig?: ConsumerConfig & { topics: Array<string | RegExp> },
  ) {
    this.kafkaConfig.logCreator = KafkaLoggerCreator;
    this.kafka = new Kafka(this.kafkaConfig);

    if (this.consumerConfig?.groupId) {
      this.consumer = this.kafka.consumer(this.consumerConfig);
    }
  }

  async onModuleInit() {
    if (this.consumer) {
      await this.consumer.connect();
      await this.consumer.subscribe({ topics: this.consumerConfig.topics, fromBeginning: false });
      await this.consumer.run({ eachMessage: this.handleMessage.bind(this), autoCommit: true });
    }
  }

  async onModuleDestroy() {
    if (this.consumer) {
      await this.consumer.disconnect();
    }
  }

  private async handleMessage(message: EachMessagePayload) {
    const payload = new KafkaMessagePayload(message);
    const event = new KafkaMessageEvent(payload.topic);
    const contexts = await this.eventEmitter.emitAsync(event.name, payload);

    let e: { context: string; error: Error } = null;

    for (const context of contexts) {
      if (context.error instanceof Error) {
        e = context;
        break;
      }
    }

    if (e === null) {
      const targets = contexts.map((context) => context.context);
      this.logger.debug({ message: 'handleMessage Succeed', payload, targets });
    } else {
      const error = {
        context: e.context,
        name: e.error.name,
        message: e.error.message,
        cause: e.error.cause,
        stack: e.error.stack,
      };

      this.logger.error({ message: 'handleMessage Failed', payload, error });
    }
  }
}
