import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { UserEntity } from './user.entity';

@Entity({ name: 'user_wallet' })
export class UserWalletEntity extends BaseEntity {
  @PrimaryColumn({ type: 'int', unsigned: true, primary: false })
  readonly userId: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  credit: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  point: number;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt: Date;

  @OneToOne(() => UserEntity, (e) => e.userWallet, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;
}
