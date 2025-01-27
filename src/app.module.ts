import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayModule } from './application/play/play.module';
import { RoomModule } from './application/room/room.module';

@Module({
  imports: [RoomModule, PlayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
