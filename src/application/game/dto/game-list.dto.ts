import { ApiResponseProperty } from '@nestjs/swagger';
import { Game } from 'src/domain/entities/game.entity';
import { GameStatus } from 'src/domain/enums';

export class GameDTO {
  @ApiResponseProperty({ type: String })
  id: string;

  @ApiResponseProperty({ type: String })
  title: string;

  @ApiResponseProperty({ type: Boolean })
  isPrivate: boolean;

  @ApiResponseProperty({ type: Number })
  waitTime: number;

  @ApiResponseProperty({ type: Number })
  maxPlayerCount: number;

  @ApiResponseProperty({ type: Number })
  playerCount: number;

  @ApiResponseProperty({ type: String, enum: GameStatus })
  status: GameStatus;

  @ApiResponseProperty({ type: Date })
  createdAt: Date;

  constructor(game: Game) {
    this.id = game.id;
    this.title = game.title;
    this.isPrivate = !!game.password;
    this.waitTime = game.waitTime;
    this.maxPlayerCount = game.maxPlayerCount;
    this.playerCount = game.playerCount;
    this.status = game.status;
    this.createdAt = game.createdAt;
  }
}

export class GameListDTO {
  @ApiResponseProperty({ type: Number })
  total: number;

  @ApiResponseProperty({ type: [GameDTO] })
  rows: GameDTO[];

  constructor(rows: Game[], total: number) {
    this.total = total;
    this.rows = rows.map((row) => new GameDTO(row));
  }
}
