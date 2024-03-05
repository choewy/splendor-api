import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from './user.entity';

export enum OAuthPlatform {
  Google = 'google',
  Naver = 'naver',
  Kakao = 'kakao',
}

@Index('oauth_idx_platform_oauth_id', ['platform', 'oauthId'])
@Entity({ name: 'oauth' })
export class OAuthEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @Column({ type: 'varchar', length: 50 })
  readonly oauthId: string;

  @Column({ type: 'varchar', length: 20 })
  readonly platform: OAuthPlatform;

  @Column({ type: 'varchar', length: 400, default: null })
  email: string | null;

  @Column({ type: 'varchar', length: 1024, default: null })
  profileImageUrl: string | null;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @ManyToOne(() => UserEntity, (e) => e.oauths, { onDelete: 'CASCADE' })
  @JoinColumn()
  readonly user: UserEntity;
}
