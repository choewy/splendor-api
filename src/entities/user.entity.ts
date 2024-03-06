import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { FollowEntity } from './follow.entity';
import { OAuthEntity } from './oauth.entity';
import { StudioEntity } from './studio.entity';
import { UserProfileImageEntity } from './user-profile-image.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @Column({ type: 'varchar', length: 50, default: null })
  nickname: string | null;

  @Column({ type: 'varchar', length: 1024, default: null })
  profileImageUrl: string | null;

  @OneToMany(() => OAuthEntity, (e) => e.user, { cascade: true })
  @JoinTable()
  oauths: OAuthEntity[];

  @OneToOne(() => UserProfileImageEntity, (e) => e.user, { cascade: true, nullable: true })
  @JoinTable()
  userProfileImage: UserProfileImageEntity | null;

  @OneToOne(() => StudioEntity, (e) => e.user, { cascade: true })
  @JoinTable()
  studio: StudioEntity;

  @OneToMany(() => FollowEntity, (e) => e.from, { cascade: true })
  @JoinTable()
  followings: FollowEntity[];

  @OneToMany(() => FollowEntity, (e) => e.to, { cascade: true })
  @JoinTable()
  followers: FollowEntity[];

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;
}
