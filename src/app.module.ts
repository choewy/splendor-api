import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayModule } from './application/play/play.module';
import { PlayerModule } from './application/player/player.module';
import { RoomModule } from './application/room/room.module';

@Module({
  imports: [PlayerModule, RoomModule, PlayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
