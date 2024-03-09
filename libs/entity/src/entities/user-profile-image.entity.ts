import { Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractFileBaseEntity } from './abstracts';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_profile_image' })
export class UserProfileImageEntity extends AbstractFileBaseEntity {
  @OneToOne(() => UserEntity, (e) => e.userProfileImage, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  user: UserEntity | null;
}
