import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { StudioEntity } from './studio.entity';

export enum StreamPlatform {
  Chzzk = 'chzzk',
  Afreeca = 'afreeca',
  YouTube = 'youtube',
}

@Entity({ name: 'studio_stream_setting' })
export class StudioStreamSettingEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @Column({ type: 'varchar', length: 20 })
  platform: StreamPlatform;

  @Column({ type: 'varchar', length: 2048 })
  url: string;

  @Column({ type: 'boolean', default: false })
  status: boolean;

  @Column({ type: 'timestamp', nullable: true })
  startAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  endAt: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt: Date;

  @OneToOne(() => StudioEntity, (e) => e.studioStreamSettings, { onDelete: 'CASCADE' })
  @JoinColumn()
  studio: StudioEntity;
}
