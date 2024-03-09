import { Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractFileBaseEntity } from './abstracts';
import { TtsVoiceEntity } from './tts-voice.entity';

@Entity({ name: 'tts_voice_image' })
export class TtsVoiceImageEntity extends AbstractFileBaseEntity {
  @OneToOne(() => TtsVoiceEntity, (e) => e.ttsVoiceImage, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  ttsVoice: TtsVoiceEntity | null;
}
