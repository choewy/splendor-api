import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { UserEntity } from './user.entity';

export enum OAuthPlatform {
  Google = 'google',
  Naver = 'naver',
  Kakao = 'kakao',
}

@Entity({ name: 'oauth' })
export class OAuthEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @Column({ type: 'varchar', length: 50 })
  readonly oauthId: string;

  @Column({ type: 'varchar', length: 20 })
  readonly platform: OAuthPlatform;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @ManyToOne(() => UserEntity, (e) => e.oauths, { onDelete: 'CASCADE' })
  @JoinColumn()
  readonly user: UserEntity;
}
