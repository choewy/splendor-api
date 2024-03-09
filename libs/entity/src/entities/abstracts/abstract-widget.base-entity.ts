import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class AbstractWidgetBaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;
}
