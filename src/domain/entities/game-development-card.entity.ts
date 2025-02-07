import { DevelopmentCard } from 'src/persistent/classes';
import { Column, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Game } from './game.entity';
import { CardLevel, CardPosition } from '../enums';

@Entity({ name: 'game_development_card', comment: '게임 발전 카드' })
@Index('game_development_card_card_idx', ['gameId', 'cardId', 'position'])
@Index('game_development_card_level_idx', ['gameId', 'level', 'position'])
export class GameDevelopmentCard {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true, comment: '게임 발전 카드 PK' })
  readonly id: string;

  @Column({ type: 'tinyint', unsigned: true, comment: '카드 번호' })
  cardId: number;

  @Column({ type: 'varchar', length: 10, comment: '카드 위치' })
  position: CardPosition;

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

  @Column({ type: 'varchar', comment: '게임 PK' })
  gameId: string;

  @ManyToOne(() => Game, (e) => e.developmentCards, { onDelete: 'CASCADE' })
  @JoinColumn()
  game: Game;

  @DeleteDateColumn({ comment: '삭제일시' })
  readonly deletedAt: Date | null;

  public static of(game: Game, position: CardPosition, card: DevelopmentCard) {
    const gameDevelopmentCard = new GameDevelopmentCard();

    gameDevelopmentCard.game = game;
    gameDevelopmentCard.position = position;
    gameDevelopmentCard.cardId = card.id;
    gameDevelopmentCard.level = card.level;
    gameDevelopmentCard.point = card.point;
    gameDevelopmentCard.costOfRuby = card.cost.ruby;
    gameDevelopmentCard.costOfSapphire = card.cost.sapphire;
    gameDevelopmentCard.costOfEmerald = card.cost.emerald;
    gameDevelopmentCard.costOfOnyx = card.cost.onyx;
    gameDevelopmentCard.costOfDiamond = card.cost.diamond;
    gameDevelopmentCard.bonusOfRuby = card.bonus.ruby;
    gameDevelopmentCard.bonusOfSapphire = card.bonus.sapphire;
    gameDevelopmentCard.bonusOfEmerald = card.bonus.emerald;
    gameDevelopmentCard.bonusOfOnyx = card.bonus.onyx;
    gameDevelopmentCard.bonusOfDiamond = card.bonus.diamond;

    return gameDevelopmentCard;
  }
}
