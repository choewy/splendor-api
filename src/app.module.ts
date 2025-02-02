import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './application/auth/auth.module';
import { GameModule } from './application/game/game.module';
import { KakaoApiModule } from './application/kakao-api/kakao-api.module';
import { OAuthModule } from './application/oauth/oauth.module';
import { PlayModule } from './application/play/play.module';
import { PlayerModule } from './application/player/player.module';
import { ProfileModule } from './application/profile/profile.module';
import { TypeOrmConfig } from './core/config/typeorm.config';
import { ContextModule } from './core/context/context.module';
import { LoggingModule } from './core/logging/logging.module';
import { PubSubModule } from './core/pubsub/pubsub.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        const typeOrmConfig = new TypeOrmConfig(configService);
        return typeOrmConfig.getModuleOptions();
      },
    }),
    ContextModule.forRoot(),
    LoggingModule,
    PubSubModule,
    KakaoApiModule,
    OAuthModule,
    AuthModule,
    ProfileModule,
    PlayerModule,
    GameModule,
    PlayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
