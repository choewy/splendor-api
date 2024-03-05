import {
  BaseEntity,
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
import { FollowEntity } from './follow.entity';
import { ForbiddenWordEntity } from './forbidden-word.entity';
import { MessageWidgetEntity } from './message-widget.entity';
import { StudioSettingEntity } from './studio-setting.entity';
import { TtsVoiceEntity } from './tts-voice.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'studio' })
export class StudioEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

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

  @OneToMany(() => FollowEntity, (e) => e.studio, { cascade: true })
  @JoinTable()
  followers: FollowEntity[];

  @OneToOne(() => StudioSettingEntity, (e) => e.studio, { cascade: true })
  @JoinTable()
  studioSetting: StudioSettingEntity;

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
