import { registerAs } from '@nestjs/config';
import { AdminConfig, ConsumerConfig, KafkaConfig as KafjaJSKafkaConfig, ProducerConfig } from 'kafkajs';

export type KafkaConfigReturnType = (topics?: Array<string | RegExp>) => {
  kafkaOptions: KafjaJSKafkaConfig;
  adminOptions?: AdminConfig;
  producerOptions?: ProducerConfig;
  consumerOptions?: ConsumerConfig & { topics: Array<string | RegExp> };
};

export const KAFKA_CONFIG = '__kafka_config__';

export const KafkaConfig = registerAs(
  KAFKA_CONFIG,
  (): KafkaConfigReturnType => (topics) => ({
    kafkaOptions: { clientId: process.env.KAFKA_CLIENT_ID, brokers: (process.env.KAFKA_BROKERS ?? '').split(',') },
    producerOptions: { allowAutoTopicCreation: true },
    consumerOptions: (topics ?? []).length > 0 ? { groupId: process.env.KAFKA_GROUP_ID, topics } : undefined,
  }),
);
