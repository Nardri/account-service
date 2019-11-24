import { Entity, Column, ManyToOne } from 'typeorm';

import BaseEntity from '../shared/base/base.entity';
import ServicesEntity from './services.entity';
import RoleEntity from './roles.entity';

export enum PermissionEnum {
  NONE = 'none',
  READ = 'read',
  WRITE = 'write',
  EDIT = 'edit',
  DELETE = 'delete',
  ALL = '*',
}

@Entity({ name: 'permissions' })
export default class PermissionEntity extends BaseEntity {
  @Column({
    nullable: false,
    type: 'enum',
    enum: PermissionEnum,
    default: PermissionEnum.NONE,
  })
  type: PermissionEnum;

  @ManyToOne(
    () => ServicesEntity,
    service => service.permissions,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  service: ServicesEntity;

  @ManyToOne(
    () => RoleEntity,
    role => role.permissions,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  role: RoleEntity;
}
