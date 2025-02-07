import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ContextService } from 'src/core/context/context.service';
import { GameDevelopmentCard } from 'src/domain/entities/game-development-card.entity';
import { GameNobleCard } from 'src/domain/entities/game-noble-card.entity';
import { GameToken } from 'src/domain/entities/game-token.entity';
import { Game } from 'src/domain/entities/game.entity';
import { PlayerBonus } from 'src/domain/entities/player-bonus.entity';
import { PlayerDevelopmentCard } from 'src/domain/entities/player-development-card.entity';
import { PlayerNobleCard } from 'src/domain/entities/player-noble-card.entity';
import { PlayerToken } from 'src/domain/entities/player-token.entity';
import { Player } from 'src/domain/entities/player.entity';
import { CardPosition, CardStatus, GameStatus } from 'src/domain/enums';
import { TokenProperty } from 'src/domain/types';
import { TakeTokenCount } from 'src/persistent/enums';
import { DataSource, EntityManager } from 'typeorm';

import { KeepCardDTO } from './dto/keep-card.dto';
import { PlayDetailDTO } from './dto/play-detail.dto';
import { PurchaseDevelopmentCardDTO } from './dto/purchase-development-card.dto';
import { PurchaseNobleCardDTO } from './dto/purchase-noble-card.dto';
import { TakeTokenDTO } from './dto/take-token.dto';

@Injectable()
export class PlayService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly contextService: ContextService,
  ) {}

  private async checkTurn() {
    const player = this.contextService.requestPlayer;
    const game = player?.game;

    if (!game) {
      throw new ForbiddenException();
    }

    if (game.currentPlayerIndex !== player.index) {
      throw new BadRequestException('당신 차례 아님');
    }

    return { player, game };
  }

  // TODO 로직 구체화하기
  private async checkNextTurn(em: EntityManager, game: Game) {
    const isNextRound = game.currentPlayerIndex === game.maxPlayerIndex;

    await em.getRepository(Game).update(game.id, {
      currentPlayerIndex: isNextRound ? 0 : () => 'currentPlayerIndex + 1',
      round: isNextRound ? () => 'round + 1' : undefined,
    });

    if (!isNextRound) {
      return true;
    }

    const playerRepository = em.getRepository(Player);
    const players = await playerRepository.find({
      relations: { developmentCards: true, nobleCards: true, token: true },
      where: { gameId: game.id },
    });

    const winners = players.filter((player) => player.point >= game.finishPoint);

    if (winners.length === 0) {
      return true;
    }

    await em.getRepository(Game).update(game.id, { status: GameStatus.Finished });

    return false;
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
    const { player, game } = await this.checkTurn();

    const countOfZeroTokens: Array<keyof Omit<TokenProperty, 'gold'>> = [];
    const countOfOneTokens: Array<keyof Omit<TokenProperty, 'gold'>> = [];
    const countOfTwoTokens: Array<keyof Omit<TokenProperty, 'gold'>> = [];

    const bodyKeys = Object.keys(body).sort((x) => (body[x]?.optional ? 1 : -1));

    for (const k of bodyKeys) {
      const key = k as keyof Omit<TokenProperty, 'gold'>;

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
    const playerToken = await playerTokenRepository.findOneBy({ playerId: player.id });

    if (!playerToken) {
      throw new BadRequestException('플레이어 토큰 정보 없음');
    }

    let playerTokenTotalCount = playerToken.ruby + playerToken.emerald + playerToken.sapphire + playerToken.onyx + playerToken.diamond + playerToken.gold;

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

    await this.dataSource.transaction(async (em) => {
      await em.getRepository(PlayerToken).update(player.id, playerToken);
      await em.getRepository(GameToken).update(game.id, gameToken);

      return this.checkNextTurn(em, game);
    });
  }

  async keepCard(body: KeepCardDTO) {
    const { player, game } = await this.checkTurn();

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

    await this.dataSource.transaction(async (em) => {
      if (openTarget) {
        await em.getRepository(GameDevelopmentCard).update(openTarget.id, { position: CardPosition.Field });
      }

      await em.getRepository(GameDevelopmentCard).softRemove(keepTarget);
      await em.getRepository(PlayerDevelopmentCard).insert(PlayerDevelopmentCard.ofKeep(player, keepTarget));

      if (gameToken.gold > 0) {
        await em.getRepository(PlayerToken).update(player.id, { gold: () => `gold + 1` });
        await em.getRepository(GameToken).update(game.id, { gold: () => `gold - 1` });
      }

      return this.checkNextTurn(em, game);
    });
  }

  async purchaseDevelopmentCard(body: PurchaseDevelopmentCardDTO) {
    const { player, game } = await this.checkTurn();

    const playerTokenRepository = this.dataSource.getRepository(PlayerToken);
    const playerToken = await playerTokenRepository.findOneBy({ playerId: player.id });

    if (!playerToken) {
      throw new BadRequestException('플레이어 토큰 정보 없음');
    }

    const playerBonusRepository = this.dataSource.getRepository(PlayerBonus);
    const playerBonus = await playerBonusRepository.findOneBy({ playerId: player.id });

    if (!playerBonus) {
      throw new BadRequestException('플레이어 보너스 정보 없음');
    }

    const gameDevelopmentCardRepository = this.dataSource.getRepository(GameDevelopmentCard);
    const purchaseTarget = await gameDevelopmentCardRepository.findOneBy({
      gameId: game.id,
      cardId: body.cardId,
      position: CardPosition.Field,
    });

    if (!purchaseTarget) {
      throw new BadRequestException('게임 발전 카드 없음');
    }

    const cost = {
      ruby: purchaseTarget.costOfRuby > 0 ? purchaseTarget.costOfRuby - playerBonus.ruby : 0,
      emerald: purchaseTarget.costOfEmerald > 0 ? purchaseTarget.costOfEmerald - playerBonus.emerald : 0,
      sapphire: purchaseTarget.costOfSapphire > 0 ? purchaseTarget.costOfSapphire - playerBonus.sapphire : 0,
      onyx: purchaseTarget.costOfOnyx > 0 ? purchaseTarget.costOfOnyx - playerBonus.onyx : 0,
      diamond: purchaseTarget.costOfDiamond > 0 ? purchaseTarget.costOfDiamond - playerBonus.diamond : 0,
      gold: body.gold ?? 0,
    };

    const costs = [
      playerToken.ruby - cost.ruby,
      playerToken.emerald - cost.emerald,
      playerToken.sapphire - cost.sapphire,
      playerToken.onyx - cost.onyx,
      playerToken.diamond - cost.diamond,
      -cost.gold,
    ];

    const costOfLeek = -costs.reduce((total, cost) => {
      if (cost < 0) {
        total += cost;
      }

      return total;
    }, 0);

    if (costOfLeek > 0) {
      throw new BadRequestException('자원(토큰, 보너스) 부족');
    }

    const openTarget = await gameDevelopmentCardRepository.findOneBy({
      gameId: game.id,
      level: purchaseTarget.level,
      position: CardPosition.Deck,
    });

    await this.dataSource.transaction(async (em) => {
      await em.getRepository(PlayerBonus).update(player.id, {
        ruby: () => `ruby + ${purchaseTarget.bonusOfRuby}`,
        sapphire: () => `sapphire + ${purchaseTarget.bonusOfSapphire}`,
        emerald: () => `emerald + ${purchaseTarget.bonusOfEmerald}`,
        onyx: () => `onyx + ${purchaseTarget.bonusOfOnyx}`,
        diamond: () => `diamond + ${purchaseTarget.bonusOfDiamond}`,
      });

      await em.getRepository(PlayerToken).update(player.id, {
        ruby: () => `IF(ruby - ${cost.ruby} < 0, 0, ruby - ${cost.ruby})`,
        sapphire: () => `IF(sapphire - ${cost.sapphire} < 0, 0, sapphire - ${cost.sapphire})`,
        emerald: () => `IF(emerald - ${cost.emerald} < 0, 0, emerald - ${cost.emerald})`,
        onyx: () => `IF(onyx - ${cost.onyx} < 0, 0, onyx - ${cost.onyx})`,
        diamond: () => `IF(diamond - ${cost.diamond} < 0, 0, diamond - ${cost.diamond})`,
        gold: () => `IF(gold - ${cost.gold} < 0, 0, gold - ${cost.gold})`,
      });

      await em.getRepository(Player).update(player.id, { point: () => `point + ${purchaseTarget.point}` });
      await em.getRepository(PlayerDevelopmentCard).insert(PlayerDevelopmentCard.ofPurchase(player, purchaseTarget));

      if (openTarget) {
        await em.getRepository(GameDevelopmentCard).update(openTarget.id, { position: CardPosition.Field });
      }

      await em.getRepository(GameDevelopmentCard).softRemove(purchaseTarget);

      return this.checkNextTurn(em, game);
    });
  }

  async purchaseNobleCard(body: PurchaseNobleCardDTO) {
    const { player, game } = await this.checkTurn();

    const gameNobleCardRepository = this.dataSource.getRepository(GameNobleCard);
    const gameNobleCard = await gameNobleCardRepository.findOneBy({ game, cardId: body.cardId });

    if (!gameNobleCard) {
      throw new BadRequestException('게임 귀족 카드 없음');
    }

    const playerBonusRepository = this.dataSource.getRepository(PlayerBonus);
    const playerBonus = await playerBonusRepository.findOneBy({ player });

    if (!playerBonus) {
      throw new BadRequestException('플레이어 보너스 정보 없음');
    }

    const validationTarget = [
      gameNobleCard.costOfRuby > playerBonus.ruby,
      gameNobleCard.costOfEmerald > playerBonus.emerald,
      gameNobleCard.costOfSapphire > playerBonus.sapphire,
      gameNobleCard.costOfOnyx > playerBonus.onyx,
      gameNobleCard.costOfDiamond > playerBonus.diamond,
    ].some((value) => value === true);

    if (validationTarget) {
      throw new BadRequestException('플레이어 보너스 부족');
    }

    await this.dataSource.transaction(async (em) => {
      await em.getRepository(PlayerNobleCard).insert(PlayerNobleCard.ofPurchase(player, gameNobleCard));
      await em.getRepository(Player).update(player.id, { point: () => `point + ${gameNobleCard.point}` });

      return this.checkNextTurn(em, game);
    });
  }
}
