import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './application/auth/auth.module';
import { KakaoApiModule } from './application/kakao-api/kakao-api.module';
import { OAuthModule } from './application/oauth/oauth.module';
import { PlayModule } from './application/play/play.module';
import { PlayerModule } from './application/player/player.module';
import { ProfileModule } from './application/profile/profile.module';
import { RoomModule } from './application/room/room.module';
import { ContextModule } from './core/context/context.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          type: 'mysql',
          host: configService.getOrThrow('DB_HOST'),
          port: configService.getOrThrow('DB_PORT'),
          username: configService.getOrThrow('DB_USERNAME'),
          password: configService.getOrThrow('DB_PASSWORD'),
          database: configService.getOrThrow('DB_DATABASE'),
          synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
          namingStrategy: new SnakeNamingStrategy(),
          entities: [`${process.cwd()}/dist/domain/entities/**/*.entity.{ts,js}`],
        };
      },
    }),
    ContextModule.forRoot(),
    KakaoApiModule,
    OAuthModule,
    AuthModule,
    ProfileModule,
    PlayerModule,
    RoomModule,
    PlayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
