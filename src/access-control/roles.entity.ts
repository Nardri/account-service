import { Entity, Column, OneToMany } from 'typeorm';

import BaseEntity from '../shared/base/base.entity';
import UserEntity from '../user/user.entity';
import PermissionEntity from './permissions.entity';

@Entity({ name: 'roles' })
export default class RoleEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  name: string;

  @OneToMany(
    () => UserEntity,
    user => user.role,
  )
  users: UserEntity;

  @OneToMany(
    () => PermissionEntity,
    permissions => permissions.role,
  )
  permissions: PermissionEntity[];
}
