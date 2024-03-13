import { KafkaStudioDonationSettingMessage, KafkaTopics } from '@libs/common';
import {
  AppConfig,
  EnsembleConfig,
  KAFKA_CONFIG,
  KafkaConfig,
  KafkaConfigReturnType,
  REDIS_CONFIG,
  RedisConfig,
  SystemConfig,
  TYPEORM_MYSQL_CONFIG,
  TypeOrmMySQLConfig,
  TypeOrmMySQLConfigReturnType,
} from '@libs/configs';
import { entities } from '@libs/entity';
import { KafkaLibsModule, KafkaMessagePayload, OnKafkaTopic } from '@libs/kafka';
import { RedisLibsModule } from '@libs/redis';
import { TypeOrmLibsModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisOptions } from 'ioredis';

import { AlertWidgetModule } from './alert-widget';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DonationModule } from './donation';
import { SessionModule } from './session';
import { StudioPlaySettingModule } from './studio-play-setting';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [SystemConfig, EnsembleConfig, AppConfig, TypeOrmMySQLConfig, RedisConfig, KafkaConfig],
      envFilePath: ['./.envs/.env', './.envs/.env.stream'],
    }),
    TypeOrmLibsModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.get<TypeOrmMySQLConfigReturnType>(TYPEORM_MYSQL_CONFIG)(entities);
      },
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
        return configService.get<KafkaConfigReturnType>(KAFKA_CONFIG)([
          KafkaTopics.Studio,
          KafkaTopics.StudioPlaySetting,
          KafkaTopics.StudioDonationSetting,
          KafkaTopics.Donation,
        ]);
      },
    }),
    SessionModule.forRoot(),
    AlertWidgetModule,
    StudioPlaySettingModule,
    DonationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  @OnKafkaTopic(KafkaTopics.Studio)
  onStudio(payload: KafkaMessagePayload) {
    console.log(payload);
  }

  @OnKafkaTopic(KafkaTopics.StudioDonationSetting)
  onStudioDonationSetting(payload: KafkaMessagePayload<KafkaStudioDonationSettingMessage>) {
    console.log(payload);
  }
}
