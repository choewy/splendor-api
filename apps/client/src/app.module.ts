import {
  AppConfig,
  GoogleOAuthConfig,
  JWT_CONFIG,
  JwtConfig,
  JwtConfigReturnType,
  KakaoOAuthConfig,
  NaverOAuthConfig,
  SystemConfig,
  TYPEORM_MYSQL_CONFIG,
  TypeOrmMySQLConfig,
  TypeOrmMySQLConfigReturnType,
} from '@libs/configs';
import { entities } from '@libs/entity';
import { JwtLibsModule } from '@libs/jwt';
import { TypeOrmLibsModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
      load: [SystemConfig, AppConfig, TypeOrmMySQLConfig, JwtConfig, GoogleOAuthConfig, KakaoOAuthConfig, NaverOAuthConfig],
      envFilePath: ['.envs/.env', '.envs/.env.client'],
    }),
    TypeOrmLibsModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.get<TypeOrmMySQLConfigReturnType>(TYPEORM_MYSQL_CONFIG)(entities);
      },
    }),
    JwtLibsModule.forRoot({
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
