import {
  AppConfig,
  GoogleOAuthConfig,
  JWT_CONFIG,
  JwtConfig,
  JwtConfigReturnType,
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
import { JwtLibsModule } from '@libs/jwt';
import { RedisLibsModule } from '@libs/redis';
import { TypeOrmLibsModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisOptions } from 'ioredis';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth';
import { FollowModule } from './follow';
import { OAuthModule } from './oauth';
import { ProfileModule } from './profile';
import { StudioModule } from './studio';
import { UserModule } from './user';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [SystemConfig, AppConfig, TypeOrmMySQLConfig, RedisConfig, JwtConfig, GoogleOAuthConfig, KakaoOAuthConfig, NaverOAuthConfig],
      envFilePath: ['.envs/.env', '.envs/.env.client'],
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
    AuthModule,
    OAuthModule,
    UserModule,
    ProfileModule,
    FollowModule,
    StudioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
