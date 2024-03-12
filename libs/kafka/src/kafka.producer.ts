import { Injectable, Logger, OnModuleDestroy, OnModuleInit, Provider } from '@nestjs/common';
import { Kafka, KafkaConfig, Producer, ProducerConfig } from 'kafkajs';

import { KafkaSendMessageCommand } from './implements';
import { KafkaLibsModuleAsyncOptions } from './interfaces';
import { KafkaLoggerCreator } from './kafka.logger';

@Injectable()
export class KafkaProducer implements OnModuleInit, OnModuleDestroy {
  static createProvider(moduleAsyncOptions: KafkaLibsModuleAsyncOptions): Provider {
    return {
      provide: KafkaProducer,
      inject: [...moduleAsyncOptions.inject],
      async useFactory(...dependencies) {
        const { kafkaOptions, producerOptions } = await moduleAsyncOptions.useFactory(...dependencies);

        return new KafkaProducer(kafkaOptions, producerOptions);
      },
    };
  }

  private readonly logger = new Logger(KafkaProducer.name);
  private readonly kafka: Kafka;
  private readonly producer: Producer;

  constructor(readonly kafkaConfig: KafkaConfig, readonly producerConfig: ProducerConfig) {
    this.kafkaConfig.logCreator = KafkaLoggerCreator;
    this.kafka = new Kafka(this.kafkaConfig);
    this.producer = this.kafka.producer(this.producerConfig);
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async send(command: KafkaSendMessageCommand) {
    return this.producer
      .send(command.transform())
      .then((records) => {
        this.logger.debug({
          message: 'Complete Send Message',
          records,
          topic: command.topic,
          messages: command.messages,
          acks: command.acks,
        });

        return records;
      })
      .catch((e) => {
        this.logger.error({
          message: 'Failed Send Message',
          error: { name: e?.name, message: e?.message, cause: e?.cause },
          topic: command.topic,
          messages: command.messages,
          acks: command.acks,
        });
      });
  }
}
