import { KafkaTopics } from '@libs/common';
import { AppConfig, KAFKA_CONFIG, KafkaConfig, KafkaConfigReturnType, REDIS_CONFIG, RedisConfig, SystemConfig } from '@libs/configs';
import { KafkaLibsModule, KafkaMessagePayload, OnKafkaMessage } from '@libs/kafka';
import { RedisLibsModule } from '@libs/redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisOptions } from 'ioredis';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [SystemConfig, AppConfig, RedisConfig, KafkaConfig],
      envFilePath: ['./.envs/.env', './.envs/.env.stream'],
    }),
    RedisLibsModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.get<RedisOptions>(REDIS_CONFIG);
      },
    }),
    KafkaLibsModule.registerAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.get<KafkaConfigReturnType>(KAFKA_CONFIG)([KafkaTopics.Studio, KafkaTopics.Donation]);
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  @OnKafkaMessage(KafkaTopics.Studio)
  onStudio(message: KafkaMessagePayload) {
    console.log(message);
  }

  @OnKafkaMessage(KafkaTopics.Donation)
  onDonation(message: KafkaMessagePayload) {
    console.log(message);
  }
}
