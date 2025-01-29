import { NobleCard } from 'src/persistent/classes';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Game } from './game.entity';

@Entity({ name: 'game_noble_card', comment: '게임 귀족 카드' })
export class GameNobleCard {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true, comment: '게임 귀족 카드 PK' })
  readonly id: string;

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

  @Column({ type: 'varchar', comment: '게임 PK' })
  gameId: string;

  @ManyToOne(() => Game, (e) => e.nobleCards, { onDelete: 'CASCADE' })
  @JoinColumn()
  game: Game;

  public static of(game: Game, card: NobleCard) {
    const gameNobleCard = new GameNobleCard();

    gameNobleCard.game = game;
    gameNobleCard.point = 3;
    gameNobleCard.cardId = card.id;
    gameNobleCard.costOfRuby = card.cost.red;
    gameNobleCard.costOfSapphire = card.cost.green;
    gameNobleCard.costOfEmerald = card.cost.blue;
    gameNobleCard.costOfOnyx = card.cost.black;
    gameNobleCard.costOfDiamond = card.cost.white;

    return gameNobleCard;
  }
}
