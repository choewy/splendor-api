import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Player } from './player.entity';

@Entity({ name: 'player_token', comment: '플레이어 토큰' })
export class PlayerToken {
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
  playerId: string;

  @OneToOne(() => Player, (e) => e.token, { onDelete: 'CASCADE' })
  @JoinColumn()
  player: Player;
}
