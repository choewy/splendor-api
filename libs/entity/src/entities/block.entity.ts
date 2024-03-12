import { BaseEntity, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { UserEntity } from './user.entity';

@Entity({ name: 'block' })
export class BlockEntity extends BaseEntity {
  @PrimaryColumn({ type: 'int', unsigned: true, primary: false })
  userId: number;

  @PrimaryColumn({ type: 'int', unsigned: true, primary: false })
  targetId: number;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt: Date;

  @ManyToOne(() => UserEntity, (e) => e.blockingHistories, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => UserEntity, (e) => e.blockedHistories, { onDelete: 'CASCADE' })
  @JoinColumn()
  target: UserEntity;
}
