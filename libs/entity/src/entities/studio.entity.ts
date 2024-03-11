import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AlertSoundEntity } from './alert-sound.entity';
import { AlertWidgetEntity } from './alert-widget.entity';
import { ForbiddenWordEntity } from './forbidden-word.entity';
import { MessageWidgetEntity } from './message-widget.entity';
import { TtsVoiceEntity } from './tts-voice.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'studio' })
export class StudioEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  alias: string;

  @Column({ type: 'varchar', length: 1000, default: null })
  introduction: string | null;

  @Column({ type: 'tinyint', unsigned: true, default: 5 })
  alertSoundVolume: number;

  @Column({ type: 'tinyint', unsigned: true, default: 5 })
  messageSoundVolume: number;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @OneToOne(() => UserEntity, (e) => e.studio, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => TtsVoiceEntity, (e) => e.studios, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  ttsVoice: TtsVoiceEntity | null;

  @ManyToOne(() => AlertSoundEntity, (e) => e.studios, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  alertSound: AlertSoundEntity | null;

  @OneToMany(() => ForbiddenWordEntity, (e) => e.studio, { cascade: true })
  @JoinTable()
  forbiddenWords: ForbiddenWordEntity[];

  @OneToOne(() => AlertWidgetEntity, (e) => e.studio, { cascade: true })
  @JoinTable()
  alertWidget: AlertWidgetEntity;

  @OneToOne(() => MessageWidgetEntity, (e) => e.studio, { cascade: true })
  @JoinTable()
  messageWidget: MessageWidgetEntity;
}
