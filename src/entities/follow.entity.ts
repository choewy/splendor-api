import { BaseEntity, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from './user.entity';

@Entity({ name: 'follow' })
export class FollowEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @CreateDateColumn()
  readonly createdAt: Date;

  @ManyToOne(() => UserEntity, (e) => e.followings, { onDelete: 'CASCADE' })
  @JoinColumn()
  from: UserEntity;

  @ManyToOne(() => UserEntity, (e) => e.followers, { onDelete: 'CASCADE' })
  @JoinColumn()
  to: UserEntity;
}
