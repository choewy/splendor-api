import { Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractFileBaseEntity } from './abstracts';
import { TtsEntity } from './tts.entity';

@Entity({ name: 'tts_image' })
export class TtsImageEntity extends AbstractFileBaseEntity {
  @OneToOne(() => TtsEntity, (e) => e.ttsImage, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  tts: TtsEntity | null;
}
