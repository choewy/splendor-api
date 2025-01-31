import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ContextService } from 'src/core/context/context.service';
import { GameDevelopmentCard } from 'src/domain/entities/game-development-card.entity';
import { GameToken } from 'src/domain/entities/game-token.entity';
import { Game } from 'src/domain/entities/game.entity';
import { PlayerDevelopmentCard } from 'src/domain/entities/player-development-card.entity';
import { PlayerToken } from 'src/domain/entities/player-token.entity';
import { CardPosition, CardStatus } from 'src/domain/enums';
import { TokenProperty } from 'src/domain/types';
import { TakeTokenCount } from 'src/persistent/enums';
import { DataSource, EntityManager } from 'typeorm';

import { KeepCardDTO } from './dto/keep-card.dto';
import { PlayDetailDTO } from './dto/play-detail.dto';
import { TakeTokenDTO } from './dto/take-token.dto';

@Injectable()
export class PlayService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly contextService: ContextService,
  ) {}

  private async nextTurn(em: EntityManager, game: Game) {
    const isNextRound = game.currentPlayerIndex === game.maxPlayerIndex;

    await em.getRepository(Game).update(game.id, {
      currentPlayerIndex: isNextRound ? 0 : () => 'currentPlayerIndex + 1',
      round: isNextRound ? () => 'round + 1' : undefined,
    });
  }

  async getDetail() {
    const player = this.contextService.requestPlayer;

    if (!player?.gameId) {
      throw new ForbiddenException();
    }

    const gameRepository = this.dataSource.getRepository(Game);
    const game = await gameRepository.findOne({
      relations: {
        players: {
          token: true,
          bonus: true,
          nobleCards: true,
          developmentCards: true,
        },
        token: true,
        developmentCards: true,
        nobleCards: true,
      },
      where: { id: player.gameId },
    });

    if (!game) {
      throw new BadRequestException();
    }

    return new PlayDetailDTO(game);
  }

  async takeToken(body: TakeTokenDTO) {
    const player = this.contextService.requestPlayer;
    const game = player?.game;

    if (!game) {
      throw new ForbiddenException();
    }

    if (game.currentPlayerIndex !== player.index) {
      throw new BadRequestException('당신 차례 아님');
    }

    const countOfZeroTokens: Array<keyof Omit<TokenProperty, 'topaz'>> = [];
    const countOfOneTokens: Array<keyof Omit<TokenProperty, 'topaz'>> = [];
    const countOfTwoTokens: Array<keyof Omit<TokenProperty, 'topaz'>> = [];

    const bodyKeys = Object.keys(body).sort((x) => (body[x]?.optional ? 1 : -1));

    for (const k of bodyKeys) {
      const key = k as keyof Omit<TokenProperty, 'topaz'>;

      switch (body[key]?.count) {
        case TakeTokenCount.One:
          countOfOneTokens.push(key);
          break;

        case TakeTokenCount.Two:
          countOfTwoTokens.push(key);
          break;

        default:
          countOfZeroTokens.push(key);
      }
    }

    if (countOfZeroTokens.length === bodyKeys.length) {
      throw new BadRequestException('잘못된 토큰 가져오기 조합');
    }

    if (countOfOneTokens.length > 3) {
      throw new BadRequestException('잘못된 토큰 가져오기 조합');
    }

    if (countOfTwoTokens.length > 1) {
      throw new BadRequestException('잘못된 토큰 가져오기 조합');
    }

    const playerTokenRepository = this.dataSource.getRepository(PlayerToken);
    const playerToken = await playerTokenRepository.findOneBy({ playerId: player?.id });

    if (!playerToken) {
      throw new BadRequestException('플레이어 토큰 정보 없음');
    }

    let playerTokenTotalCount = playerToken.ruby + playerToken.emerald + playerToken.sapphire + playerToken.onyx + playerToken.diamond + playerToken.topaz;

    if (playerTokenTotalCount > 9) {
      throw new BadRequestException('플레이어 토큰 소지 수량 10개 이상');
    }

    const gameTokenRepository = this.dataSource.getRepository(GameToken);
    const gameToken = await gameTokenRepository.findOneBy({ gameId: player?.gameId });

    if (!gameToken) {
      throw new BadRequestException('게임 토큰 정보 없음');
    }

    for (const countOfOneToken of countOfOneTokens) {
      if (playerTokenTotalCount > 9) {
        break;
      }

      if (gameToken[countOfOneToken] < 1) {
        throw new BadRequestException('토큰 수량 부족(세종류)');
      }

      playerTokenTotalCount += 1;
      playerToken[countOfOneToken] += 1;
      gameToken[countOfOneToken] -= 1;
    }

    for (const countOfTwoToken of countOfTwoTokens) {
      if (playerTokenTotalCount > 9) {
        break;
      }

      if (playerTokenTotalCount > 8) {
        if (gameToken[countOfTwoToken] < 1) {
          throw new BadRequestException('토큰 수량 부족(한종류 1개)');
        }

        playerTokenTotalCount += 1;
        playerToken[countOfTwoToken] += 1;
        gameToken[countOfTwoToken] -= 1;

        break;
      }

      if (gameToken[countOfTwoToken] < 4) {
        throw new BadRequestException('토큰 수량 부족(한종류 2개)');
      }

      playerTokenTotalCount += 2;
      playerToken[countOfTwoToken] += 2;
      gameToken[countOfTwoToken] -= 2;
    }

    return this.dataSource.transaction(async (em) => {
      await em.getRepository(PlayerToken).update(player.id, playerToken);
      await em.getRepository(GameToken).update(game.id, gameToken);

      await this.nextTurn(em, game);
    });
  }

  async keepCard(body: KeepCardDTO) {
    const player = this.contextService.requestPlayer;
    const game = player?.game;

    if (!game) {
      throw new ForbiddenException();
    }

    if (game.maxPlayerIndex !== player.index) {
      throw new BadRequestException('당신 차례 아님');
    }

    const playerDevelopmentCardRepository = this.dataSource.getRepository(PlayerDevelopmentCard);
    const playerDibedDevelopmentCardCount = await playerDevelopmentCardRepository.countBy({
      playerId: player.id,
      status: CardStatus.Keep,
    });

    if (playerDibedDevelopmentCardCount > 2) {
      throw new BadRequestException('찜 제한 개수 초과');
    }

    const gameDevelopmentCardRepository = this.dataSource.getRepository(GameDevelopmentCard);

    let [keepTarget, openTarget]: [GameDevelopmentCard | null, GameDevelopmentCard | null] = [null, null];

    switch (body.position) {
      case CardPosition.Deck:
        if (!body.level) {
          throw new BadRequestException('카드 레벨 선택 필요');
        }

        keepTarget = await gameDevelopmentCardRepository.findOneBy({
          gameId: game.id,
          level: body.level,
          position: body.position,
        });

        if (!keepTarget) {
          throw new BadRequestException('카드 정보 없음');
        }

        openTarget = null;

        break;

      case CardPosition.Field:
        if (!body.cardId) {
          throw new BadRequestException('카드 번호 선택 필요');
        }

        keepTarget = await gameDevelopmentCardRepository.findOneBy({
          gameId: game.id,
          cardId: body.cardId,
          position: body.position,
        });

        if (!keepTarget) {
          throw new BadRequestException('카드 정보 없음');
        }

        openTarget = await gameDevelopmentCardRepository.findOneBy({
          gameId: game.id,
          level: keepTarget?.level,
          position: CardPosition.Deck,
        });

        break;
    }

    const gameTokenRepository = this.dataSource.getRepository(GameToken);
    const gameToken = await gameTokenRepository.findOneBy({ gameId: game.id });

    if (!gameToken) {
      throw new BadRequestException('게임 토큰 정보 없음');
    }

    return this.dataSource.transaction(async (em) => {
      if (openTarget) {
        await em.getRepository(GameDevelopmentCard).update(openTarget.id, { position: CardPosition.Field });
      }

      await em.getRepository(GameDevelopmentCard).softRemove(keepTarget);
      await em.getRepository(PlayerDevelopmentCard).insert(PlayerDevelopmentCard.ofKeep(player, keepTarget));

      if (gameToken.topaz > 0) {
        await em.getRepository(PlayerToken).update(player.id, { topaz: () => `topaz + 1` });
        await em.getRepository(GameToken).update(game.id, { topaz: () => `topaz - 1` });
      }

      await this.nextTurn(em, game);
    });
  }

  async purchaseCard() {
    const player = this.contextService.requestPlayer;
    const game = player?.game;

    if (!game) {
      throw new ForbiddenException();
    }

    if (game.maxPlayerIndex !== player.index) {
      throw new BadRequestException('당신 차례 아님');
    }

    // TODO 플레이어의 보너스 및 토큰 수량 파악(플레이어가 소지한 노란색 토큰 수량 고려)
    // TODO 플레이어의 토근 수량 차감
    // TODO 플레이어의 보너스 증가
    // TODO 플레이어의 점수 증가
    // TODO 덱에서 새로운 카드 뽑아서 필드에 추가

    return this.dataSource.transaction(async (em) => {
      await this.nextTurn(em, game);
    });
  }
}
