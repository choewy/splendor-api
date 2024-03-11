import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { StudioEntity } from './studio.entity';

@Entity({ name: 'studio_play_setting' })
export class StudioPlaySettingEntity extends BaseEntity {
  @PrimaryColumn({ type: 'int', unsigned: true, primary: false })
  readonly studioId: number;

  @Column({ type: 'boolean', default: true })
  autoPlay: boolean;

  @Column({ type: 'tinyint', unsigned: true, default: 5 })
  alertVolume: number;

  @Column({ type: 'tinyint', unsigned: true, default: 5 })
  messageVolume: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: '1.0' })
  delay: string;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: '5.0' })
  maxSeconds: string;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt: Date;

  @OneToOne(() => StudioEntity, (e) => e.studioPlaySetting, { onDelete: 'CASCADE' })
  @JoinColumn()
  studio: StudioEntity;
}
