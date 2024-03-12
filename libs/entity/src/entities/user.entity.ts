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

import { BlockEntity } from './block.entity';
import { DonationEntity } from './donation.entity';
import { FollowEntity } from './follow.entity';
import { OAuthEntity } from './oauth.entity';
import { StudioEntity } from './studio.entity';
import { UserDonationsEntity } from './user-donation.entity';
import { UserFollowCountEntity } from './user-follow-count.entity';
import { UserWalletEntity } from './user-wallet.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @Column({ type: 'varchar', length: 50, default: null })
  nickname: string | null;

  @Column({ type: 'varchar', length: 1024, default: null })
  profileImageUrl: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt: Date;

  @OneToMany(() => OAuthEntity, (e) => e.user, { cascade: true })
  @JoinTable()
  oauths: OAuthEntity[];

  @OneToOne(() => UserWalletEntity, (e) => e.user, { cascade: true })
  @JoinTable()
  userWallet: UserWalletEntity;

  @OneToOne(() => UserFollowCountEntity, (e) => e.user, { cascade: true })
  @JoinTable()
  userFollowCount: UserFollowCountEntity;

  @OneToOne(() => UserDonationsEntity, (e) => e.user, { cascade: true })
  @JoinTable()
  userDonations: UserDonationsEntity;

  @OneToOne(() => StudioEntity, (e) => e.user, { cascade: true })
  @JoinTable()
  studio: StudioEntity;

  @OneToMany(() => FollowEntity, (e) => e.user, { cascade: true })
  @JoinTable()
  followingHistories: FollowEntity[];

  @OneToMany(() => FollowEntity, (e) => e.target, { cascade: true })
  @JoinTable()
  followedHistories: FollowEntity[];

  @JoinTable()
  followed: FollowEntity | null;

  @OneToMany(() => BlockEntity, (e) => e.user, { cascade: true })
  @JoinTable()
  blockingHistories: BlockEntity[];

  @OneToMany(() => BlockEntity, (e) => e.target, { cascade: true })
  @JoinTable()
  blockedHistories: BlockEntity[];

  @JoinTable()
  blocked: BlockEntity | null;

  @OneToMany(() => DonationEntity, (e) => e.sender, { cascade: true })
  @JoinTable()
  sentDonations: DonationEntity[];

  @OneToMany(() => DonationEntity, (e) => e.recipient, { cascade: true })
  @JoinTable()
  receivedDonation: DonationEntity[];
}
