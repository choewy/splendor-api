import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { StudioEntity } from './studio.entity';

@Entity({ name: 'studio_setting' })
export class StudioSettingEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @Column({ type: 'tinyint', unsigned: true, default: 5 })
  alertSoundVolume: number;

  @Column({ type: 'tinyint', unsigned: true, default: 5 })
  messageSoundVolume: number;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @OneToOne(() => StudioEntity, (e) => e.studioSetting, { onDelete: 'CASCADE' })
  @JoinColumn()
  studio: StudioEntity;
}
