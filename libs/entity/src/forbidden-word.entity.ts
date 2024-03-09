import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { StudioEntity } from './studio.entity';

@Entity({ name: 'forbidden_word' })
export class ForbiddenWordEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @Column({ type: 'varchar', length: 200 })
  word: string;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @ManyToOne(() => StudioEntity, (e) => e.forbiddenWords, { onDelete: 'CASCADE' })
  @JoinColumn()
  studio: StudioEntity;
}
