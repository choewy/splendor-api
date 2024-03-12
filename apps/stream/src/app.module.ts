import { KafkaStreamTopics } from '@libs/common';
import { AppConfig, KAFKA_CONFIG, KafkaConfig, KafkaConfigReturnType, RedisConfig, SystemConfig } from '@libs/configs';
import { KafkaLibsModule, KafkaMessagePayload, OnKafkaMessage } from '@libs/kafka';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [SystemConfig, AppConfig, RedisConfig, KafkaConfig],
      envFilePath: ['./.envs/.env', './.envs/.env.stream'],
    }),
    KafkaLibsModule.registerAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.get<KafkaConfigReturnType>(KAFKA_CONFIG)(Object.values(KafkaStreamTopics));
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  @OnKafkaMessage(KafkaStreamTopics.Stream)
  onStream(message: KafkaMessagePayload) {
    console.log(message);
  }
}
