import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractFileBaseEntity } from './abstracts';
import { TtsVoiceEntity } from './tts-voice.entity';

@Entity({ name: 'tts_voice_sample_sound' })
export class TtsVoiceSampleSoundEntity extends AbstractFileBaseEntity {
  @Column({ type: 'varchar', length: 128 })
  text: string;

  @OneToOne(() => TtsVoiceEntity, (e) => e.ttsVoiceSampleSound, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  ttsVoice: TtsVoiceEntity | null;
}
