import { ApiResponseProperty } from '@nestjs/swagger';
import { Game } from 'src/domain/entities/game.entity';
import { CardPosition } from 'src/domain/enums';

import { PlayDetailGameDevelopmentCardDTO, PlayDetailGameNobleCardDTO, PlayDetailGameTokenDTO } from './play-detail-game.dto';
import { PlayDetailPlayerDTO } from './play-detail-player.dto';

export class PlayDetailDTO {
  @ApiResponseProperty({ type: String })
  id: string;

  @ApiResponseProperty({ type: String })
  title: string;

  @ApiResponseProperty({ type: Number })
  round: number;

  @ApiResponseProperty({ type: Number })
  currentPlayerIndex: number;

  @ApiResponseProperty({ type: Number })
  nextPlayerIndex: number;

  @ApiResponseProperty({ type: Number })
  waitTime: number;

  @ApiResponseProperty({ type: Date })
  createdAt: Date;

  @ApiResponseProperty({ type: PlayDetailGameTokenDTO })
  token: PlayDetailGameTokenDTO;

  @ApiResponseProperty({ type: [PlayDetailGameNobleCardDTO] })
  nobleCards: PlayDetailGameNobleCardDTO[];

  @ApiResponseProperty({ type: Number })
  developmentCardsOnDeckCount: number;

  @ApiResponseProperty({ type: [PlayDetailGameDevelopmentCardDTO] })
  developmentCardsOnField: PlayDetailGameDevelopmentCardDTO[];

  @ApiResponseProperty({ type: [PlayDetailPlayerDTO] })
  players: PlayDetailPlayerDTO[];

  constructor(game: Game) {
    this.id = game.id;
    this.title = game.title;
    this.round = game.round;
    this.currentPlayerIndex = game.currentPlayerIndex;
    this.nextPlayerIndex = game.currentPlayerIndex === game.maxPlayerIndex ? 0 : game.currentPlayerIndex + 1;
    this.waitTime = game.waitTime;
    this.createdAt = game.createdAt;
    this.token = new PlayDetailGameTokenDTO(game.token);
    this.nobleCards = game.nobleCards.map((nobleCard) => new PlayDetailGameNobleCardDTO(nobleCard));
    this.developmentCardsOnDeckCount = game.developmentCards.filter((developmentCard) => developmentCard.position === CardPosition.Deck).length;
    this.developmentCardsOnField = game.developmentCards
      .filter((developmentCard) => developmentCard.position === CardPosition.Field)
      .map((developmentCard) => new PlayDetailGameDevelopmentCardDTO(developmentCard));
    this.players = game.players.map((player) => new PlayDetailPlayerDTO(player));
  }
}
