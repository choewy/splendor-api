import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { AbstractWidgetBaseEntity } from './abstracts';
import { AlertSoundEntity } from './alert-sound.entity';
import { StudioEntity } from './studio.entity';

@Entity({ name: 'alert_widget' })
export class AlertWidgetEntity extends AbstractWidgetBaseEntity {
  @OneToOne(() => StudioEntity, (e) => e.alertWidget, { onDelete: 'CASCADE' })
  @JoinColumn()
  studio: StudioEntity;

  @ManyToOne(() => AlertSoundEntity, (e) => e.alertWidgets, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  alertSound: AlertSoundEntity | null;
}
