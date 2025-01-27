import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Game } from './game.entity';
import { GameDevelopmentCardPosition } from '../enums';

@Entity({ name: 'game_development_card', comment: '게임 발전 카드' })
@Index('game_development_card_idx', ['gameId', 'cardId', 'level', 'position'])
export class GameDevelopmentCard {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ type: 'tinyint', unsigned: true, comment: '카드 번호' })
  cardId: number;

  @Column({ type: 'varchar', length: 10, comment: '카드 위치' })
  position: GameDevelopmentCardPosition;

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

  @Column({ type: 'varchar', comment: '게임 PK' })
  gameId: string;

  @ManyToOne(() => Game, (e) => e.developmentCards, { onDelete: 'CASCADE' })
  @JoinColumn()
  game: Game;
}
