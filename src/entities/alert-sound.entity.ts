import { Entity, JoinTable, OneToMany } from 'typeorm';

import { AbstractFileBaseEntity } from './abstracts';
import { AlertWidgetEntity } from './alert-widget.entity';

@Entity({ name: 'alert_sound' })
export class AlertSoundEntity extends AbstractFileBaseEntity {
  @OneToMany(() => AlertWidgetEntity, (e) => e.alertSound, { cascade: true })
  @JoinTable()
  alertWidgets: AlertWidgetEntity[];
}
