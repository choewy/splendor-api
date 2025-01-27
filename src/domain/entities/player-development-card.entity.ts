import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { PlayerDevelopmentCardStatus } from '../enums';
import { Player } from './player.entity';

@Entity({ name: 'player_development_card', comment: '플레이어 발전 카드' })
@Index('player_development_card_idx', ['playerId', 'cardId', 'level', 'status'])
export class PlayerDevelopmentCard {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ type: 'varchar', comment: '플레이어 PK' })
  playerId: string;

  @Column({ type: 'tinyint', unsigned: true, comment: '카드 번호' })
  cardId: number;

  @Column({ type: 'varchar', length: 10, comment: '카드 상태' })
  status: PlayerDevelopmentCardStatus;

  @Column({ type: 'tinyint', unsigned: true, comment: '카드 레벨' })
  level: number;

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
}
