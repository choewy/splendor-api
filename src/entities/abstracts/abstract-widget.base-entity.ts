import { BaseEntity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class AbstractWidgetBaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @Column({ type: 'varchar', length: 100 })
  readonly key: string;

  @Column({ type: 'float', unsigned: true })
  left: number;

  @Column({ type: 'float', unsigned: true })
  top: number;

  @Column({ type: 'float', unsigned: true })
  width: number;

  @Column({ type: 'float', unsigned: true })
  height: number;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;
}
