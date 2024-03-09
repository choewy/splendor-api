import { Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractWidgetBaseEntity } from './abstracts';
import { StudioEntity } from './studio.entity';

@Entity({ name: 'message_widget' })
export class MessageWidgetEntity extends AbstractWidgetBaseEntity {
  @OneToOne(() => StudioEntity, (e) => e.messageWidget, { onDelete: 'CASCADE' })
  @JoinColumn()
  studio: StudioEntity;
}
