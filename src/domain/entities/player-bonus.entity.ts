import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Player } from './player.entity';
import { TokenProperty } from '../types';

@Entity({ name: 'player_bonus', comment: '플레이어 보너스' })
export class PlayerBonus implements Omit<TokenProperty, 'topaz'> {
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

  @Column({ type: 'varchar' })
  playerId: string;

  @OneToOne(() => Player, (e) => e.token, { onDelete: 'CASCADE' })
  @JoinColumn()
  player: Player;

  public static of(player: Player) {
    const playerBonus = new PlayerBonus();

    playerBonus.player = player;
    playerBonus.ruby = 0;
    playerBonus.sapphire = 0;
    playerBonus.emerald = 0;
    playerBonus.onyx = 0;
    playerBonus.diamond = 0;

    return playerBonus;
  }
}
