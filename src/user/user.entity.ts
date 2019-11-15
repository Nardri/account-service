import { Entity, Column } from 'typeorm';
import { Exclude } from 'class-transformer';

import BaseEntity from '../shared/base/base.entity';

@Entity({ name: 'users' })
export default class UserEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  email: string;

  @Exclude()
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  password: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  verified: boolean;
}
