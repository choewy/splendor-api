import { ApiResponseProperty } from '@nestjs/swagger';
import { PlayerBonus } from 'src/domain/entities/player-bonus.entity';
import { PlayerDevelopmentCard } from 'src/domain/entities/player-development-card.entity';
import { PlayerNobleCard } from 'src/domain/entities/player-noble-card.entity';
import { PlayerToken } from 'src/domain/entities/player-token.entity';
import { Player } from 'src/domain/entities/player.entity';
import { CardLevel, CardStatus } from 'src/domain/enums';

export class PlayDetailPlayerTokenDTO {
  @ApiResponseProperty({ type: Number })
  total: number;

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
  topaz: number;

  constructor(playerToken: PlayerToken) {
    this.total = playerToken.ruby + playerToken.sapphire + playerToken.emerald + playerToken.onyx + playerToken.diamond + playerToken.topaz;
    this.ruby = playerToken.ruby;
    this.sapphire = playerToken.sapphire;
    this.emerald = playerToken.emerald;
    this.onyx = playerToken.onyx;
    this.diamond = playerToken.diamond;
    this.topaz = playerToken.topaz;
  }
}

export class PlayDetailPlayerBonusDTO {
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

  constructor(playerBonus: PlayerBonus) {
    this.ruby = playerBonus.ruby;
    this.sapphire = playerBonus.sapphire;
    this.emerald = playerBonus.emerald;
    this.onyx = playerBonus.onyx;
    this.diamond = playerBonus.diamond;
  }
}

export class PlayDetailPlayerNobleCardDTO {
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

  constructor(playerNobleCard: PlayerNobleCard) {
    this.cardId = playerNobleCard.cardId;
    this.point = playerNobleCard.point;
    this.costOfRuby = playerNobleCard.costOfRuby;
    this.costOfSapphire = playerNobleCard.costOfSapphire;
    this.costOfEmerald = playerNobleCard.costOfEmerald;
    this.costOfOnyx = playerNobleCard.costOfOnyx;
    this.costOfDiamond = playerNobleCard.costOfDiamond;
  }
}

export class PlayDetailPlayerDevelopmentCardDTO {
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

  constructor(playerDevelopmentCard: PlayerDevelopmentCard) {
    this.cardId = playerDevelopmentCard.cardId;
    this.level = playerDevelopmentCard.level;
    this.point = playerDevelopmentCard.point;
    this.costOfRuby = playerDevelopmentCard.costOfRuby;
    this.costOfSapphire = playerDevelopmentCard.costOfSapphire;
    this.costOfEmerald = playerDevelopmentCard.costOfEmerald;
    this.costOfOnyx = playerDevelopmentCard.costOfOnyx;
    this.costOfDiamond = playerDevelopmentCard.costOfDiamond;
    this.bonusOfRuby = playerDevelopmentCard.bonusOfRuby;
    this.bonusOfSapphire = playerDevelopmentCard.bonusOfSapphire;
    this.bonusOfEmerald = playerDevelopmentCard.bonusOfEmerald;
    this.bonusOfOnyx = playerDevelopmentCard.bonusOfOnyx;
    this.bonusOfDiamond = playerDevelopmentCard.bonusOfDiamond;
  }
}

export class PlayDetailPlayerDTO {
  @ApiResponseProperty({ type: String })
  id: string;

  @ApiResponseProperty({ type: Boolean })
  isHost: boolean;

  @ApiResponseProperty({ type: Number })
  index: number;

  @ApiResponseProperty({ type: Number })
  point: number;

  @ApiResponseProperty({ type: PlayDetailPlayerTokenDTO })
  token: PlayDetailPlayerTokenDTO;

  @ApiResponseProperty({ type: PlayDetailPlayerBonusDTO })
  bonus: PlayDetailPlayerBonusDTO;

  @ApiResponseProperty({ type: [PlayDetailPlayerNobleCardDTO] })
  nobleCards: PlayDetailPlayerNobleCardDTO[];

  @ApiResponseProperty({ type: [PlayDetailPlayerDevelopmentCardDTO] })
  developmentCards: PlayDetailPlayerDevelopmentCardDTO[];

  @ApiResponseProperty({ type: [PlayDetailPlayerDevelopmentCardDTO] })
  keepCards: PlayDetailPlayerDevelopmentCardDTO[];

  constructor(player: Player) {
    this.id = player.id;
    this.isHost = player.isHost;
    this.index = player.index;
    this.point = player.point;
    this.token = new PlayDetailPlayerTokenDTO(player.token);
    this.bonus = new PlayDetailPlayerBonusDTO(player.bonus);
    this.nobleCards = player.nobleCards.map((nobleCard) => new PlayDetailPlayerNobleCardDTO(nobleCard));
    this.developmentCards = player.developmentCards
      .filter((developmentCard) => developmentCard.status === CardStatus.Purchased)
      .map((developmentCard) => new PlayDetailPlayerDevelopmentCardDTO(developmentCard));
    this.keepCards = player.developmentCards
      .filter((developmentCard) => developmentCard.status === CardStatus.Keep)
      .map((developmentCard) => new PlayDetailPlayerDevelopmentCardDTO(developmentCard));
  }
}
