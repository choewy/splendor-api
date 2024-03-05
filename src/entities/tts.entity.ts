import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { MessageWidgetEntity } from './message-widget.entity';
import { TtsImageEntity } from './tts-image.entity';
import { TtsSampleSoundEntity } from './tts-sample-sound.entity';

export enum TtsPlatform {
  Google = 'google',
  Typecast = 'typecast',
}

export enum TtsLanguage {
  Kr = 'KR-ko',
  En = 'EN-us',
}

@Entity({ name: 'tts' })
export class TtsEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @Column({ type: 'varchar', length: 50 })
  ttsId: string;

  @Column({ type: 'varchar', length: 20 })
  platform: TtsPlatform;

  @Column({ type: 'varchar', length: 20 })
  language: TtsLanguage;

  @Column({ type: 'varchar', length: 50 })
  alias: string;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @OneToOne(() => TtsImageEntity, (e) => e.tts, { cascade: true, nullable: true })
  @JoinTable()
  ttsImage: TtsImageEntity | null;

  @OneToOne(() => TtsSampleSoundEntity, (e) => e.tts, { cascade: true, nullable: true })
  @JoinTable()
  ttsSampleSound: TtsSampleSoundEntity | null;

  @OneToMany(() => MessageWidgetEntity, (e) => e.tts, { cascade: true })
  @JoinTable()
  messageWidgets: MessageWidgetEntity[];
}
