import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { GameDevelopmentCard } from './game-development-card.entity';
import { GameNobleCard } from './game-noble-card.entity';
import { GameToken } from './game-token.entity';
import { GameStatus } from '../enums';
import { Player } from './player.entity';

@Entity({ name: 'game', comment: '게임' })
export class Game {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ type: 'varchar', length: 100, comment: '방제' })
  title: string;

  @Column({ type: 'varchar', length: 255, default: null, comment: '방 비밀번호' })
  password: string | null;

  @Column({ type: 'mediumint', unsigned: true, default: 60, comment: '턴 제한시간(초)' })
  waitTime: number;

  @Column({ type: 'tinyint', unsigned: true, default: 4, comment: '인원 제한 수' })
  maxPlayerCount: number;

  @Column({ type: 'tinyint', unsigned: true, default: 1, comment: '참여 인원 수' })
  playerCount: number;

  @Column({ type: 'varchar', length: 10, default: GameStatus.Wating, comment: '상태' })
  status: GameStatus;

  @Column({ type: 'tinyint', unsigned: true, default: 1, comment: '라운드 수' })
  round: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0, comment: '플레이어 커서' })
  cursor: number;

  @CreateDateColumn({ comment: '생성일시' })
  readonly createdAt: Date;

  @UpdateDateColumn({ comment: '수정일시' })
  readonly updatedAt: Date;

  @DeleteDateColumn({ comment: '삭제일시' })
  readonly deletedAt: Date | null;

  @OneToMany(() => Player, (e) => e.game, { cascade: true })
  @JoinTable()
  players: Player[];

  @OneToOne(() => GameToken, (e) => e.game, { cascade: true })
  @JoinTable()
  token: GameToken;

  @OneToMany(() => GameNobleCard, (e) => e.game, { cascade: true })
  @JoinTable()
  nobleCards: GameNobleCard[];

  @OneToMany(() => GameDevelopmentCard, (e) => e.game, { cascade: true })
  @JoinTable()
  developmentCards: GameDevelopmentCard[];
}
