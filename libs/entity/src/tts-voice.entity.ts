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

import { StudioEntity } from './studio.entity';
import { TtsVoiceImageEntity } from './tts-voice-image.entity';
import { TtsVoiceSampleSoundEntity } from './tts-voice-sample-sound.entity';

export enum TtsVoicePlatform {
  Google = 'google',
  Typecast = 'typecast',
}

export enum TtsVoiceLanguage {
  Kr = 'KR-ko',
  En = 'EN-us',
}

@Entity({ name: 'tts_voice' })
export class TtsVoiceEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @Column({ type: 'varchar', length: 50 })
  ttsId: string;

  @Column({ type: 'varchar', length: 20 })
  platform: TtsVoicePlatform;

  @Column({ type: 'varchar', length: 20 })
  language: TtsVoiceLanguage;

  @Column({ type: 'varchar', length: 50 })
  alias: string;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @OneToMany(() => StudioEntity, (e) => e.ttsVoice, { cascade: true })
  @JoinTable()
  studios: StudioEntity[];

  @OneToOne(() => TtsVoiceImageEntity, (e) => e.ttsVoice, { cascade: true, nullable: true })
  @JoinTable()
  ttsVoiceImage: TtsVoiceImageEntity | null;

  @OneToOne(() => TtsVoiceSampleSoundEntity, (e) => e.ttsVoice, { cascade: true, nullable: true })
  @JoinTable()
  ttsVoiceSampleSound: TtsVoiceSampleSoundEntity | null;
}
