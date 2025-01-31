import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { GameNobleCard } from './game-noble-card.entity';
import { Player } from './player.entity';

@Entity({ name: 'player_noble_card', comment: '플레이어 귀족 카드' })
export class PlayerNobleCard {
  @PrimaryColumn({ type: 'varchar', length: 32, comment: '게임 귀족 카드 PK' })
  id: string;

  @Column({ type: 'tinyint', unsigned: true, comment: '카드번호' })
  cardId: number;

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

  @Column({ type: 'varchar', length: 32, comment: '플레이어 PK' })
  playerId: string;

  @ManyToOne(() => Player, (e) => e.nobleCards, { onDelete: 'CASCADE' })
  @JoinColumn()
  player: Player;

  @DeleteDateColumn({ comment: '삭제일시' })
  readonly deletedAt: Date | null;

  public static ofPurchase(player: Player, gameNobleCard: GameNobleCard) {
    const playerNobleCard = new PlayerNobleCard();

    playerNobleCard.playerId = player.id;
    playerNobleCard.cardId = gameNobleCard.cardId;
    playerNobleCard.point = gameNobleCard.point;
    playerNobleCard.costOfRuby = gameNobleCard.costOfRuby;
    playerNobleCard.costOfEmerald = gameNobleCard.costOfEmerald;
    playerNobleCard.costOfSapphire = gameNobleCard.costOfSapphire;
    playerNobleCard.costOfOnyx = gameNobleCard.costOfOnyx;
    playerNobleCard.costOfDiamond = gameNobleCard.costOfDiamond;

    return playerNobleCard;
  }
}
