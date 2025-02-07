import { Column, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { Player } from './player.entity';
import { TokenProperty } from '../types';

@Entity({ name: 'player_token', comment: '플레이어 토큰' })
export class PlayerToken implements TokenProperty {
  @PrimaryColumn({ type: 'varchar', length: 36, comment: '플레이어 PK' })
  playerId: string;

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

  @Column({ type: 'tinyint', unsigned: true, default: 0, comment: '황금' })
  gold: number;

  @OneToOne(() => Player, (e) => e.token, { onDelete: 'CASCADE' })
  @JoinColumn()
  player: Player;

  @DeleteDateColumn({ comment: '삭제일시' })
  readonly deletedAt: Date | null;

  public static of(player: Player) {
    const playerToken = new PlayerToken();

    playerToken.player = player;
    playerToken.ruby = 0;
    playerToken.sapphire = 0;
    playerToken.emerald = 0;
    playerToken.onyx = 0;
    playerToken.diamond = 0;
    playerToken.gold = 0;

    return playerToken;
  }
}
