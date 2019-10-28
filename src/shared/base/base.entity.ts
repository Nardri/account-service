import { PrimaryColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

export default abstract class BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: 20,
  })
  id: string;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  constructor(partial?: Partial<BaseEntity>) {
    Object.assign(this, partial);
  }
}
