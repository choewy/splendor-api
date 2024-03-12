import { Injectable, Logger, OnModuleInit, Provider } from '@nestjs/common';
import { Kafka, KafkaConfig, Producer, ProducerConfig } from 'kafkajs';

import { KafkaSendMessageCommand } from './implements';
import { KafkaLibsModuleAsyncOptions } from './interfaces';

@Injectable()
export class KafkaProducer implements OnModuleInit {
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

  constructor(kafkaConfig: KafkaConfig, producerConfig: ProducerConfig) {
    this.kafka = new Kafka(kafkaConfig);
    this.producer = this.kafka.producer(producerConfig);
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async send(command: KafkaSendMessageCommand) {
    return this.producer
      .send(command.transform())
      .then((records) => {
        this.logger.debug({ message: 'Complete Send Message', command });

        return records;
      })
      .catch((e) => {
        this.logger.error({ message: 'Failed Send Message', command, error: { name: e?.name, message: e?.message, cause: e?.cause } });
      });
  }
}
