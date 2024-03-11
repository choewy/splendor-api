import { BaseEntity, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { UserEntity } from './user.entity';

@Entity({ name: 'follow' })
export class FollowEntity extends BaseEntity {
  @PrimaryColumn({ type: 'int', unsigned: true, primary: false })
  fromId: number;

  @PrimaryColumn({ type: 'int', unsigned: true, primary: false })
  toId: number;

  @CreateDateColumn()
  readonly createdAt: Date;

  @ManyToOne(() => UserEntity, (e) => e.followings, { onDelete: 'CASCADE' })
  @JoinColumn()
  from: UserEntity;

  @ManyToOne(() => UserEntity, (e) => e.followers, { onDelete: 'CASCADE' })
  @JoinColumn()
  to: UserEntity;
}
