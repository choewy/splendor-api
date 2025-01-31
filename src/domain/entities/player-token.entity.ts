import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Player } from './player.entity';
import { TokenProperty } from '../types';

@Entity({ name: 'player_token', comment: '플레이어 토큰' })
export class PlayerToken implements TokenProperty {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ type: 'tinyint', unsigned: true, default: 0, comment: '루비' })
  ruby: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0, comment: '사파이어' })
  sapphire: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0, comment: '에메랄드' })
  emerald: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0, comment: '오닉스' })
  onyx: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0, comment: '다이아몬드' })
  diamond: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0, comment: '토파즈' })
  topaz: number;

  @Column({ type: 'varchar' })
  playerId: string;

  @OneToOne(() => Player, (e) => e.token, { onDelete: 'CASCADE' })
  @JoinColumn()
  player: Player;

  public static of(player: Player) {
    const playerToken = new PlayerToken();

    playerToken.player = player;
    playerToken.ruby = 0;
    playerToken.sapphire = 0;
    playerToken.emerald = 0;
    playerToken.onyx = 0;
    playerToken.diamond = 0;
    playerToken.topaz = 0;

    return playerToken;
  }
}
