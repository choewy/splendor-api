import { BaseEntity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class AbstractFileBaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  readonly id: number;

  @Column({ type: 'varchar', length: 64 })
  contentType: string;

  @Column({ type: 'varchar', length: 50 })
  filename: string;

  @Column({ type: 'varchar', length: 200 })
  key: string;

  @CreateDateColumn()
  readonly createdAt: Date;

  @CreateDateColumn()
  readonly updatedAt: Date;
}
