import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from './user.entity';

@Entity({ name: 'donation' })
export class DonationEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @Column({ type: 'varchar', length: 50 })
  nickname: string;

  @Column({ type: 'smallint', unsigned: true })
  amount: number;

  @Column({ type: 'varchar', length: 128, default: null })
  message: string | null;

  @Column({ type: 'varchar', length: 1024, default: null })
  imageUrl: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt: Date;

  @ManyToOne(() => UserEntity, (e) => e.sentDonations, { onDelete: 'CASCADE' })
  @JoinColumn()
  sender: UserEntity;

  @ManyToOne(() => UserEntity, (e) => e.receivedDonation, { onDelete: 'CASCADE' })
  @JoinColumn()
  recipient: UserEntity;
}
