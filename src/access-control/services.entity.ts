import { Entity, Column, OneToMany } from 'typeorm';

import BaseEntity from '../shared/base/base.entity';
import PermissionEntity from './permissions.entity';

@Entity({ name: 'services' })
export default class ServicesEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @OneToMany(
    () => PermissionEntity,
    permission => permission.service,
    {
      cascade: true,
    },
  )
  permissions: PermissionEntity[];
}
