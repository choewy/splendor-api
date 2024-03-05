import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { AbstractWidgetBaseEntity } from './abstracts';
import { StudioEntity } from './studio.entity';
import { TtsEntity } from './tts.entity';

@Entity({ name: 'message_widget' })
export class MessageWidgetEntity extends AbstractWidgetBaseEntity {
  @OneToOne(() => StudioEntity, (e) => e.messageWidget, { onDelete: 'CASCADE' })
  @JoinColumn()
  studio: StudioEntity;

  @ManyToOne(() => TtsEntity, (e) => e.messageWidgets, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  tts: TtsEntity | null;
}
