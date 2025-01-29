import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

import { OAuthPlatform } from '../enums';
import { User } from './user.entity';

@Entity({ name: 'oauth', comment: 'OAuth' })
@Unique('oauth_unique', ['platform', 'oauthId'])
export class OAuth {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true, comment: 'PK' })
  readonly id: string;

  @Column({ type: 'varchar', length: 10, comment: 'OAuth 플랫폼' })
  platform: OAuthPlatform;

  @Column({ type: 'varchar', length: 20, comment: 'OAuth ID' })
  oauthId: string;

  @Column({ type: 'varchar', length: 340, default: null, comment: 'OAuth 이메일' })
  email: string | null;

  @Column({ type: 'varchar', length: 50, default: null, comment: 'OAuth 닉네임' })
  nickname: string | null;

  @Column({ type: 'varchar', length: 1024, default: null, comment: 'OAuth 프로필 이미지 경로' })
  imageUrl: string | null;

  @CreateDateColumn({ comment: '생성일시' })
  readonly createdAt: Date;

  @UpdateDateColumn({ comment: '수정일시' })
  readonly updatedAt: Date;

  @DeleteDateColumn({ comment: '삭제일시' })
  readonly deletedAt: Date | null;

  @Column({ type: 'bigint', unsigned: true, comment: '사용자 PK' })
  userId: string;

  @ManyToOne(() => User, (e) => e.oauths, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
