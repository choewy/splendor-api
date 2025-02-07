import { ApiResponseProperty } from '@nestjs/swagger';
import { GameDevelopmentCard } from 'src/domain/entities/game-development-card.entity';
import { GameNobleCard } from 'src/domain/entities/game-noble-card.entity';
import { GameToken } from 'src/domain/entities/game-token.entity';
import { CardLevel } from 'src/domain/enums';

export class PlayDetailGameTokenDTO {
  @ApiResponseProperty({ type: Number })
  ruby: number;

  @ApiResponseProperty({ type: Number })
  sapphire: number;

  @ApiResponseProperty({ type: Number })
  emerald: number;

  @ApiResponseProperty({ type: Number })
  onyx: number;

  @ApiResponseProperty({ type: Number })
  diamond: number;

  @ApiResponseProperty({ type: Number })
  gold: number;

  constructor(gameToken: GameToken) {
    this.ruby = gameToken.ruby;
    this.sapphire = gameToken.sapphire;
    this.emerald = gameToken.emerald;
    this.onyx = gameToken.onyx;
    this.diamond = gameToken.diamond;
    this.gold = gameToken.gold;
  }
}

export class PlayDetailGameNobleCardDTO {
  @ApiResponseProperty({ type: Number })
  cardId: number;

  @ApiResponseProperty({ type: Number })
  point: number;

  @ApiResponseProperty({ type: Number })
  costOfRuby: number;

  @ApiResponseProperty({ type: Number })
  costOfSapphire: number;

  @ApiResponseProperty({ type: Number })
  costOfEmerald: number;

  @ApiResponseProperty({ type: Number })
  costOfOnyx: number;

  @ApiResponseProperty({ type: Number })
  costOfDiamond: number;

  constructor(gameNobleCard: GameNobleCard) {
    this.cardId = gameNobleCard.cardId;
    this.point = gameNobleCard.point;
    this.costOfRuby = gameNobleCard.costOfRuby;
    this.costOfSapphire = gameNobleCard.costOfSapphire;
    this.costOfEmerald = gameNobleCard.costOfEmerald;
    this.costOfOnyx = gameNobleCard.costOfOnyx;
    this.costOfDiamond = gameNobleCard.costOfDiamond;
  }
}

export class PlayDetailGameDevelopmentCardDTO {
  @ApiResponseProperty({ type: Number })
  cardId: number;

  @ApiResponseProperty({ type: Number, enum: CardLevel })
  level: CardLevel;

  @ApiResponseProperty({ type: Number })
  point: number;

  @ApiResponseProperty({ type: Number })
  costOfRuby: number;

  @ApiResponseProperty({ type: Number })
  costOfSapphire: number;

  @ApiResponseProperty({ type: Number })
  costOfEmerald: number;

  @ApiResponseProperty({ type: Number })
  costOfOnyx: number;

  @ApiResponseProperty({ type: Number })
  costOfDiamond: number;

  @ApiResponseProperty({ type: Number })
  bonusOfRuby: number;

  @ApiResponseProperty({ type: Number })
  bonusOfSapphire: number;

  @ApiResponseProperty({ type: Number })
  bonusOfEmerald: number;

  @ApiResponseProperty({ type: Number })
  bonusOfOnyx: number;

  @ApiResponseProperty({ type: Number })
  bonusOfDiamond: number;

  constructor(gameDevelopmentCard: GameDevelopmentCard) {
    this.cardId = gameDevelopmentCard.cardId;
    this.level = gameDevelopmentCard.level;
    this.point = gameDevelopmentCard.point;
    this.costOfRuby = gameDevelopmentCard.costOfRuby;
    this.costOfSapphire = gameDevelopmentCard.costOfSapphire;
    this.costOfEmerald = gameDevelopmentCard.costOfEmerald;
    this.costOfOnyx = gameDevelopmentCard.costOfOnyx;
    this.costOfDiamond = gameDevelopmentCard.costOfDiamond;
    this.bonusOfRuby = gameDevelopmentCard.bonusOfRuby;
    this.bonusOfSapphire = gameDevelopmentCard.bonusOfSapphire;
    this.bonusOfEmerald = gameDevelopmentCard.bonusOfEmerald;
    this.bonusOfOnyx = gameDevelopmentCard.bonusOfOnyx;
    this.bonusOfDiamond = gameDevelopmentCard.bonusOfDiamond;
  }
}
