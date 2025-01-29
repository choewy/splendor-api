import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { PlayerBonus } from './player-bonus.entity';
import { PlayerDevelopmentCard } from './player-development-card.entity';
import { PlayerNobleCard } from './player-noble-card.entity';
import { PlayerToken } from './player-token.entity';
import { User } from './user.entity';
import { PlayerStatus } from '../enums';
import { Game } from './game.entity';

@Entity({ name: 'player', comment: '플레이어' })
export class Player {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ type: 'boolean', default: false, comment: '준비 여부' })
  isReady: boolean;

  @Column({ type: 'boolean', default: false, comment: '방장 여부' })
  isHost: boolean;

  @Column({ type: 'tinyint', unsigned: true, default: 0, comment: '점수' })
  point: number;

  @Column({ type: 'varchar', length: 10, default: PlayerStatus.Activated, comment: '상태' })
  status: PlayerStatus;

  @CreateDateColumn({ comment: '생성일시' })
  readonly createdAt: Date;

  @UpdateDateColumn({ comment: '수정일시' })
  readonly updatedAt: Date;

  @DeleteDateColumn({ comment: '삭제일시' })
  readonly deletedAt: Date | null;

  @Column({ type: 'bigint', unsigned: true, comment: '사용자 PK' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ type: 'varchar', comment: '게임 PK' })
  gameId: string;

  @ManyToOne(() => Game, (e) => e.players, { onDelete: 'CASCADE' })
  @JoinColumn()
  game: Game;

  @OneToOne(() => PlayerToken, (e) => e.player, { cascade: true })
  @JoinTable()
  token: PlayerToken;

  @OneToOne(() => PlayerBonus, (e) => e.player, { cascade: true })
  @JoinTable()
  bonus: PlayerBonus;

  @OneToMany(() => PlayerNobleCard, (e) => e.player, { cascade: true })
  @JoinTable()
  nobleCards: PlayerNobleCard[];

  @OneToMany(() => PlayerDevelopmentCard, (e) => e.player, { cascade: true })
  @JoinTable()
  developmentCards: PlayerDevelopmentCard[];
}
