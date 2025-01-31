import { Column, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { Game } from './game.entity';
import { TokenProperty } from '../types';

@Entity({ name: 'game_token', comment: '게임 토큰' })
export class GameToken implements TokenProperty {
  @PrimaryColumn({ type: 'varchar', length: 36, comment: '게임 PK' })
  gameId: string;

  @Column({ type: 'tinyint', unsigned: true, comment: '루비' })
  ruby: number;

  @Column({ type: 'tinyint', unsigned: true, comment: '사파이어' })
  sapphire: number;

  @Column({ type: 'tinyint', unsigned: true, comment: '에메랄드' })
  emerald: number;

  @Column({ type: 'tinyint', unsigned: true, comment: '오닉스' })
  onyx: number;

  @Column({ type: 'tinyint', unsigned: true, comment: '다이아몬드' })
  diamond: number;

  @Column({ type: 'tinyint', unsigned: true, comment: '토파즈' })
  topaz: number;

  @OneToOne(() => Game, (e) => e.token, { onDelete: 'CASCADE' })
  @JoinColumn()
  game: Game;

  @DeleteDateColumn({ comment: '삭제일시' })
  readonly deletedAt: Date | null;

  public static of(game: Game, tokenCount: number) {
    const gameToken = new GameToken();

    gameToken.gameId = game.id;
    gameToken.ruby = tokenCount;
    gameToken.sapphire = tokenCount;
    gameToken.emerald = tokenCount;
    gameToken.onyx = tokenCount;
    gameToken.diamond = tokenCount;
    gameToken.topaz = 5;

    return gameToken;
  }
}
