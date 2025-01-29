import { CreateDateColumn, DeleteDateColumn, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { OAuth } from './oauth.entity';

@Entity({ name: 'user', comment: '사용자' })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true, comment: '사용자 PK' })
  readonly id: string;

  @CreateDateColumn({ comment: '생성일시' })
  readonly createdAt: Date;

  @UpdateDateColumn({ comment: '수정일시' })
  readonly updatedAt: Date;

  @DeleteDateColumn({ comment: '삭제일시' })
  readonly deletedAt: Date | null;

  @OneToMany(() => OAuth, (e) => e.user, { cascade: true })
  @JoinTable()
  oauths: OAuth[];
}
