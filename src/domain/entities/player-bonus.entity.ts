import { Column, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { Player } from './player.entity';
import { TokenProperty } from '../types';

@Entity({ name: 'player_bonus', comment: '플레이어 보너스' })
export class PlayerBonus implements Omit<TokenProperty, 'gold'> {
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

  @OneToOne(() => Player, (e) => e.token, { onDelete: 'CASCADE' })
  @JoinColumn()
  player: Player;

  @DeleteDateColumn({ comment: '삭제일시' })
  readonly deletedAt: Date | null;

  public static of(player: Player) {
    const playerBonus = new PlayerBonus();

    playerBonus.playerId = player.id;
    playerBonus.ruby = 0;
    playerBonus.sapphire = 0;
    playerBonus.emerald = 0;
    playerBonus.onyx = 0;
    playerBonus.diamond = 0;

    return playerBonus;
  }
}
