import { Module } from '@nestjs/common';

import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  controllers: [GameController],
  providers: [GameService, GameGateway],
})
export class GameModule {}
