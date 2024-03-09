import { Column, Entity, JoinTable, OneToMany } from 'typeorm';

import { AbstractFileBaseEntity } from './abstracts';
import { StudioEntity } from './studio.entity';

@Entity({ name: 'alert_sound' })
export class AlertSoundEntity extends AbstractFileBaseEntity {
  @Column({ type: 'varchar', length: 50 })
  alias: string;

  @OneToMany(() => StudioEntity, (e) => e.alertSound, { cascade: true })
  @JoinTable()
  studios: StudioEntity[];
}
