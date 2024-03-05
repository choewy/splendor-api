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

import { AccountEntity } from './account.entity';
import { StudioEntity } from './studio.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @Column({ type: 'varchar', length: 50 })
  nickname: string;

  @OneToMany(() => AccountEntity, (e) => e.user, { cascade: true })
  @JoinTable()
  accounts: AccountEntity[];

  @OneToOne(() => StudioEntity, (e) => e.user, { cascade: true })
  @JoinTable()
  studio: StudioEntity;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;
}
