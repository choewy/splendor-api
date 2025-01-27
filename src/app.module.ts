import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './application/auth/auth.module';
import { PlayModule } from './application/play/play.module';
import { PlayerModule } from './application/player/player.module';
import { ProfileModule } from './application/profile/profile.module';
import { RoomModule } from './application/room/room.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          type: 'mysql',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          synchronize: configService.get('NODE_ENV') === 'local',
          namingStrategy: new SnakeNamingStrategy(),
          entities: [`${process.cwd()}/dist/domain/entities/**/*.entity.{ts,js}`],
        };
      },
    }),
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
