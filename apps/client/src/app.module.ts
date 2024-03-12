import {
  AppConfig,
  GoogleOAuthConfig,
  JWT_CONFIG,
  JwtConfig,
  JwtConfigReturnType,
  KAFKA_CONFIG,
  KafkaConfig,
  KafkaConfigReturnType,
  KakaoOAuthConfig,
  NaverOAuthConfig,
  REDIS_CONFIG,
  RedisConfig,
  SystemConfig,
  TYPEORM_MYSQL_CONFIG,
  TypeOrmMySQLConfig,
  TypeOrmMySQLConfigReturnType,
} from '@libs/configs';
import { entities } from '@libs/entity';
import { HealthLibsModule } from '@libs/health';
import { JwtLibsModule } from '@libs/jwt';
import { KafkaLibsModule } from '@libs/kafka';
import { RedisLibsModule } from '@libs/redis';
import { TypeOrmLibsModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisOptions } from 'ioredis';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth';
import { FollowModule } from './follow';
import { ForbiddenWordsModule } from './forbidden-words';
import { OAuthModule } from './oauth';
import { ProfileModule } from './profile';
import { StudioModule } from './studio';
import { UserModule } from './user';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        SystemConfig,
        AppConfig,
        TypeOrmMySQLConfig,
        RedisConfig,
        KafkaConfig,
        JwtConfig,
        GoogleOAuthConfig,
        KakaoOAuthConfig,
        NaverOAuthConfig,
      ],
      envFilePath: ['.envs/.env', '.envs/.env.client', '.envs/.env.mysql', '.envs/.env.redis'],
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
    JwtLibsModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.get<JwtConfigReturnType>(JWT_CONFIG);
      },
    }),
    KafkaLibsModule.registerAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.get<KafkaConfigReturnType>(KAFKA_CONFIG)();
      },
    }),
    HealthLibsModule.register(),
    AuthModule,
    OAuthModule,
    UserModule,
    ProfileModule,
    FollowModule,
    StudioModule,
    ForbiddenWordsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
