import { ModuleMetadata, Provider, Type } from '@nestjs/common';
import { AdminConfig, ConsumerConfig, KafkaConfig, ProducerConfig } from 'kafkajs';

export type KafkaModuleOptions = {
  kafkaOptions: KafkaConfig;
  adminOptions?: AdminConfig;
  consumerOptions?: ConsumerConfig & { topics: Array<string | RegExp> };
  producerOptions?: ProducerConfig;
};

export type KafkaOptionsFactory = {
  createJwtOptions(): Promise<KafkaModuleOptions> | KafkaModuleOptions;
};

export interface KafkaLibsModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  global?: boolean;
  useExisting?: Type<KafkaOptionsFactory>;
  useClass?: Type<KafkaOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<KafkaModuleOptions> | KafkaModuleOptions;
  inject?: any[];
  extraProviders?: Provider[];
}
