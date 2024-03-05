import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from './user.entity';

export enum AccountPlatform {
  Google = 'google',
  Naver = 'naver',
  Kakao = 'kakao',
}

@Entity({ name: 'account' })
export class AccountEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @Column({ type: 'varchar', length: 20 })
  platform: AccountPlatform;

  @ManyToOne(() => UserEntity, (e) => e.accounts)
  @JoinColumn()
  user: UserEntity;
}
