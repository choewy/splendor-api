import {
  AppConfig,
  JWT_CONFIG,
  JwtConfig,
  JwtConfigReturnType,
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
import { JwtLibsModule } from '@libs/jwt';
import { KafkaLibsModule } from '@libs/kafka';
import { RedisLibsModule } from '@libs/redis';
import { TypeOrmLibsModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisOptions } from 'ioredis';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [SystemConfig, AppConfig, TypeOrmMySQLConfig, RedisConfig, KafkaConfig, JwtConfig],
      envFilePath: ['./.envs/.env', './.envs/.env.admin'],
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
        return configService.get<KafkaConfigReturnType>(KAFKA_CONFIG)();
      },
    }),
    JwtLibsModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.get<JwtConfigReturnType>(JWT_CONFIG);
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
