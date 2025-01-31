import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ContextService } from 'src/core/context/context.service';
import { GameDevelopmentCard } from 'src/domain/entities/game-development-card.entity';
import { GameNobleCard } from 'src/domain/entities/game-noble-card.entity';
import { GameToken } from 'src/domain/entities/game-token.entity';
import { Game } from 'src/domain/entities/game.entity';
import { Player } from 'src/domain/entities/player.entity';
import { GameDevelopmentCardPosition, GameStatus } from 'src/domain/enums';
import { DEVELOPMENT_CARDS_OF_LEVEL_1, DEVELOPMENT_CARDS_OF_LEVEL_2, DEVELOPMENT_CARDS_OF_LEVEL_3, NOBLE_CARDS } from 'src/persistent/constants';
import { DataSource } from 'typeorm';

import { ChangePlayerReadyStatus } from './dto/change-player-ready-status.dto';
import { CreateGameDTO } from './dto/create-game.dto';
import { GameListDTO } from './dto/game-list.dto';
import { GetGameListQueryParamDTO } from './dto/get-game-list-query-param.dto';

@Injectable()
export class GameService {
  constructor(
    private readonly contextService: ContextService,
    private readonly dataSource: DataSource,
  ) {}

  async list(queryParam: GetGameListQueryParamDTO) {
    const [rows, total] = await this.dataSource.getRepository(Game).findAndCount({
      relations: { players: true },
      where: { players: { isHost: true } },
      skip: Math.max(0, queryParam.skip),
      take: Math.min(20, queryParam.take),
    });

    return new GameListDTO(rows, total);
  }

  async create(body: CreateGameDTO) {
    const oauth = this.contextService.requestUser;
    const player = this.contextService.requestPlayer;

    if (player) {
      throw new ConflictException();
    }

    const playerRepository = this.dataSource.getRepository(Player);
    const gameRepository = this.dataSource.getRepository(Game);
    const game = gameRepository.create({
      title: body.title,
      password: body.password ? bcrypt.hashSync(body.password, 10) : null,
      waitTime: body.waitTime,
      maxPlayerCount: body.maxPlayerCount,
      playerCount: 1,
      players: [
        playerRepository.create({
          userId: oauth.userId,
          isHost: true,
        }),
      ],
    });

    await gameRepository.save(game);
  }

  async changeReadyStatus(body: ChangePlayerReadyStatus) {
    const player = this.contextService.requestPlayer;

    if (!player) {
      throw new BadRequestException();
    }

    const playerRepository = this.dataSource.getRepository(Player);
    await playerRepository.update(player.id, { isReady: body.isReady });
  }

  async start() {
    const player = this.contextService.requestPlayer;

    if (!player || !player.isHost || !player.isReady) {
      throw new BadRequestException();
    }

    const gameRepository = this.dataSource.getRepository(Game);
    const game = await gameRepository.findOne({
      relations: { players: true },
      where: { id: player.gameId },
    });

    if (!game) {
      throw new BadRequestException();
    }

    const gamePlayerCount = game.players.length;

    if (gamePlayerCount < 2 || gamePlayerCount > 4 || game.players.some((player) => player.isReady === false)) {
      throw new BadRequestException();
    }

    const gameToken = GameToken.of(game, gamePlayerCount + ([2, 3].includes(gamePlayerCount) ? 2 : 3));
    const gameNobleCards = [...NOBLE_CARDS]
      .sort(() => Math.random() - 0.5)
      .slice(0, gamePlayerCount + 1)
      .map((card) => GameNobleCard.of(game, card));

    const gameDevelopmentCards: GameDevelopmentCard[] = ([] as GameDevelopmentCard[]).concat(
      [...DEVELOPMENT_CARDS_OF_LEVEL_1]
        .sort(() => Math.random() - 0.5)
        .map((card, i) => GameDevelopmentCard.of(game, i < 4 ? GameDevelopmentCardPosition.Field : GameDevelopmentCardPosition.Deck, card)),
      [...DEVELOPMENT_CARDS_OF_LEVEL_2]
        .sort(() => Math.random() - 0.5)
        .map((card, i) => GameDevelopmentCard.of(game, i < 4 ? GameDevelopmentCardPosition.Field : GameDevelopmentCardPosition.Deck, card)),
      [...DEVELOPMENT_CARDS_OF_LEVEL_3]
        .sort(() => Math.random() - 0.5)
        .map((card, i) => GameDevelopmentCard.of(game, i < 4 ? GameDevelopmentCardPosition.Field : GameDevelopmentCardPosition.Deck, card)),
    );

    await this.dataSource.transaction(async (em) => {
      const gameRepository = em.getRepository(Game);
      const gameTokenRepository = em.getRepository(GameToken);
      const gameNobleCardRepository = em.getRepository(GameNobleCard);
      const gameDevelopmentCardRepository = em.getRepository(GameDevelopmentCard);

      await Promise.all([
        gameRepository.update(game.id, { status: GameStatus.Playing }),
        gameTokenRepository.insert(gameToken),
        gameNobleCardRepository.insert(gameNobleCards),
        gameDevelopmentCardRepository.insert(gameDevelopmentCards),
      ]);
    });
  }

  async join(gameId: string) {
    const oauth = this.contextService.requestUser;
    const player = this.contextService.requestPlayer;

    if (player) {
      throw new ConflictException();
    }

    const gameRepository = this.dataSource.getRepository(Game);
    const game = await gameRepository.findOneBy({ id: gameId });

    if (!game) {
      throw new BadRequestException();
    }

    if (game.status !== GameStatus.Wating) {
      throw new BadRequestException();
    }

    if (game.playerCount >= game.maxPlayerCount) {
      throw new BadRequestException();
    }

    await this.dataSource.transaction(async (em) => {
      const gameRepository = em.getRepository(Game);
      const playerRepository = em.getRepository(Player);

      await Promise.all([
        playerRepository.insert(playerRepository.create({ game, userId: oauth.userId, isHost: false })),
        gameRepository.update(game.id, { playerCount: game.playerCount + 1 }),
      ]);
    });
  }

  async leave() {
    const player = this.contextService.requestPlayer;

    if (!player) {
      throw new BadRequestException();
    }

    const gameRepository = this.dataSource.getRepository(Game);
    const game = await gameRepository.findOne({
      relations: { players: true },
      where: { id: player.gameId },
    });

    if (!game) {
      throw new BadRequestException();
    }

    await this.dataSource.transaction(async (em) => {
      const gameRepository = em.getRepository(Game);
      const playerRepository = em.getRepository(Player);

      if (game.playerCount < 2) {
        await playerRepository.softDelete({ gameId: player.gameId });
        await gameRepository.softDelete(player.gameId);

        return;
      }

      const nextHost = game.players.find(({ id }) => id !== player.id);

      if (player.isHost && nextHost) {
        await playerRepository.update(nextHost.id, { isHost: true });
      }

      await playerRepository.softDelete(player.id);
    });
  }
}
