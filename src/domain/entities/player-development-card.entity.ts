import { Column, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { CardLevel, CardStatus } from '../enums';
import { GameDevelopmentCard } from './game-development-card.entity';
import { Player } from './player.entity';

@Entity({ name: 'player_development_card', comment: '플레이어 발전 카드' })
@Index('player_development_card_idx', ['playerId', 'cardId', 'level', 'status'])
export class PlayerDevelopmentCard {
  @PrimaryColumn({ type: 'varchar', length: 32, comment: '게임 발전 카드 PK' })
  id: string;

  @Column({ type: 'varchar', comment: '플레이어 PK' })
  playerId: string;

  @Column({ type: 'tinyint', unsigned: true, comment: '카드 번호' })
  cardId: number;

  @Column({ type: 'varchar', length: 10, comment: '카드 상태' })
  status: CardStatus;

  @Column({ type: 'tinyint', unsigned: true, comment: '카드 레벨' })
  level: CardLevel;

  @Column({ type: 'tinyint', unsigned: true, default: 0, comment: '카드 점수' })
  point: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0, comment: '루비(비용)' })
  costOfRuby: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0, comment: '사파이어(비용)' })
  costOfSapphire: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0, comment: '에메랄드(비용)' })
  costOfEmerald: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0, comment: '오닉스(비용)' })
  costOfOnyx: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0, comment: '다이아몬드(비용)' })
  costOfDiamond: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0, comment: '루비(보너스)' })
  bonusOfRuby: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0, comment: '사파이어(보너스)' })
  bonusOfSapphire: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0, comment: '에메랄드(보너스)' })
  bonusOfEmerald: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0, comment: '오닉스(보너스)' })
  bonusOfOnyx: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0, comment: '다이아몬드(보너스)' })
  bonusOfDiamond: number;

  @ManyToOne(() => Player, (e) => e.developmentCards, { onDelete: 'CASCADE' })
  @JoinColumn()
  player: Player;

  @DeleteDateColumn({ comment: '삭제일시' })
  readonly deletedAt: Date | null;

  public static ofKeep(player: Player, gameDevelopmentCard: GameDevelopmentCard) {
    const playerDevelopmentCard = new PlayerDevelopmentCard();

    playerDevelopmentCard.playerId = player.id;
    playerDevelopmentCard.id = gameDevelopmentCard.id;
    playerDevelopmentCard.cardId = gameDevelopmentCard.cardId;
    playerDevelopmentCard.level = gameDevelopmentCard.level;
    playerDevelopmentCard.point = gameDevelopmentCard.point;
    playerDevelopmentCard.costOfRuby = gameDevelopmentCard.costOfRuby;
    playerDevelopmentCard.costOfSapphire = gameDevelopmentCard.costOfSapphire;
    playerDevelopmentCard.costOfEmerald = gameDevelopmentCard.costOfEmerald;
    playerDevelopmentCard.costOfOnyx = gameDevelopmentCard.costOfOnyx;
    playerDevelopmentCard.costOfDiamond = gameDevelopmentCard.costOfDiamond;
    playerDevelopmentCard.bonusOfRuby = gameDevelopmentCard.bonusOfRuby;
    playerDevelopmentCard.bonusOfSapphire = gameDevelopmentCard.bonusOfSapphire;
    playerDevelopmentCard.bonusOfEmerald = gameDevelopmentCard.bonusOfEmerald;
    playerDevelopmentCard.bonusOfOnyx = gameDevelopmentCard.bonusOfOnyx;
    playerDevelopmentCard.bonusOfDiamond = gameDevelopmentCard.bonusOfDiamond;
    playerDevelopmentCard.status = CardStatus.Keep;

    return playerDevelopmentCard;
  }

  public static ofPurchased(player: Player, gameDevelopmentCard: GameDevelopmentCard) {
    const playerDevelopmentCard = new PlayerDevelopmentCard();

    playerDevelopmentCard.playerId = player.id;
    playerDevelopmentCard.id = gameDevelopmentCard.id;
    playerDevelopmentCard.cardId = gameDevelopmentCard.cardId;
    playerDevelopmentCard.level = gameDevelopmentCard.level;
    playerDevelopmentCard.point = gameDevelopmentCard.point;
    playerDevelopmentCard.costOfRuby = gameDevelopmentCard.costOfRuby;
    playerDevelopmentCard.costOfSapphire = gameDevelopmentCard.costOfSapphire;
    playerDevelopmentCard.costOfEmerald = gameDevelopmentCard.costOfEmerald;
    playerDevelopmentCard.costOfOnyx = gameDevelopmentCard.costOfOnyx;
    playerDevelopmentCard.costOfDiamond = gameDevelopmentCard.costOfDiamond;
    playerDevelopmentCard.bonusOfRuby = gameDevelopmentCard.bonusOfRuby;
    playerDevelopmentCard.bonusOfSapphire = gameDevelopmentCard.bonusOfSapphire;
    playerDevelopmentCard.bonusOfEmerald = gameDevelopmentCard.bonusOfEmerald;
    playerDevelopmentCard.bonusOfOnyx = gameDevelopmentCard.bonusOfOnyx;
    playerDevelopmentCard.bonusOfDiamond = gameDevelopmentCard.bonusOfDiamond;
    playerDevelopmentCard.status = CardStatus.Purchased;

    return playerDevelopmentCard;
  }
}
