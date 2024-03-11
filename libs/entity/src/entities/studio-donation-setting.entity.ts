import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { StudioEntity } from './studio.entity';

@Entity({ name: 'studio_donation_setting' })
export class StudioDonationSettingEntity extends BaseEntity {
  @PrimaryColumn({ type: 'int', unsigned: true, primary: false })
  readonly studioId: number;

  @Column({ type: 'smallint', unsigned: true, default: 1 })
  min: number;

  @Column({ type: 'smallint', unsigned: true, default: 1000 })
  max: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt: Date;

  @OneToOne(() => StudioEntity, (e) => e.studioDonationSetting, { onDelete: 'CASCADE' })
  @JoinColumn()
  studio: StudioEntity;
}
