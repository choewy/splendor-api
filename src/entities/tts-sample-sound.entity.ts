import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractFileBaseEntity } from './abstracts';
import { TtsEntity } from './tts.entity';

@Entity({ name: 'tts_sample_sound' })
export class TtsSampleSoundEntity extends AbstractFileBaseEntity {
  @Column({ type: 'varchar', length: 128 })
  text: string;

  @OneToOne(() => TtsEntity, (e) => e.ttsSampleSound, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  tts: TtsEntity | null;
}
