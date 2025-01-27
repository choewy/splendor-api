import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Game } from './game.entity';

@Entity({ name: 'game_token', comment: '게임 토큰' })
export class GameToken {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

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

  @Column({ type: 'varchar' })
  gameId: string;

  @OneToOne(() => Game, (e) => e.token, { onDelete: 'CASCADE' })
  @JoinColumn()
  game: Game;
}
