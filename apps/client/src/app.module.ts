import {
  GoogleOAuthConfig,
  KakaoOAuthConfig,
  NaverOAuthConfig,
  TYPEORM_MYSQL_CONFIG,
  TypeOrmMySQLConfig,
  TypeOrmMySQLConfigReturnType,
} from '@libs/configs';
import { entities } from '@libs/entity';
import { TypeOrmLibsModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OAuthModule } from './oauth';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [TypeOrmMySQLConfig, GoogleOAuthConfig, KakaoOAuthConfig, NaverOAuthConfig],
    }),
    TypeOrmLibsModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.get<TypeOrmMySQLConfigReturnType>(TYPEORM_MYSQL_CONFIG)(entities);
      },
    }),
    OAuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
