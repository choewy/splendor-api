import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { UserEntity } from './user.entity';

@Entity({ name: 'user_donations' })
export class UserDonationsEntity {
  @PrimaryColumn({ type: 'int', unsigned: true })
  readonly userId: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  sendCount: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  sendAmount: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  receivedCount: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  receivedAmount: number;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt: Date;

  @OneToOne(() => UserEntity, (e) => e.userDonations, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;
}
