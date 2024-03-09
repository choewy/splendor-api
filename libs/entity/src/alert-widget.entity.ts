import { Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractWidgetBaseEntity } from './abstracts';
import { StudioEntity } from './studio.entity';

@Entity({ name: 'alert_widget' })
export class AlertWidgetEntity extends AbstractWidgetBaseEntity {
  @OneToOne(() => StudioEntity, (e) => e.alertWidget, { onDelete: 'CASCADE' })
  @JoinColumn()
  studio: StudioEntity;
}
