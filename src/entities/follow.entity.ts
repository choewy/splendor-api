import { BaseEntity, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { StudioEntity } from './studio.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'follow' })
export class FollowEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @CreateDateColumn()
  readonly createdAt: Date;

  @ManyToOne(() => UserEntity, (e) => e.followings, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => StudioEntity, (e) => e.followers, { onDelete: 'CASCADE' })
  @JoinColumn()
  studio: StudioEntity;
}
