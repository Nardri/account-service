import { EntityRepository } from 'typeorm';

import RoleEntity from './roles.entity';
import ServicesEntity from './services.entity';
import PermissionEntity, { PermissionEnum } from './permissions.entity';
import { TRoleEntity, TServicesEntity } from '../shared/base/base.type';
import BaseRepository from '../shared/base/base.repository';

@EntityRepository(RoleEntity)
export class RoleRepository extends BaseRepository<RoleEntity> {
  async getRoles(id?: string): Promise<TRoleEntity> {
    const qb = this.createQueryBuilder('roles')
      .leftJoin('roles.permissions', 'permission')
      .leftJoin('permission.service', 'service')
      .select([
        'roles.id',
        'roles.name',
        'permission.id',
        'permission.type',
        'service.id',
        'service.name',
      ])
      .orderBy('roles.createdAt', 'DESC');

    if (id) {
      return qb
        .where('roles.id = :roleId', { roleId: id })
        .addSelect(['roles.createdAt'])
        .getOne();
    }

    return qb.getMany();
  }
}

@EntityRepository(ServicesEntity)
export class ServicesRepository extends BaseRepository<ServicesEntity> {
  async getServices(id?: string): Promise<TServicesEntity> {
    const qb = this.createQueryBuilder('services')
      .leftJoin('services.permissions', 'permissions')
      .leftJoin('permissions.role', 'role')
      .select([
        'services.id',
        'services.name',
        'services.isActive',
        'permissions.id',
        'permissions.type',
        'role.id',
        'role.name',
      ])
      .orderBy('services.createdAt', 'DESC');

    if (id) {
      return qb
        .where('services.id = :serviceId', { serviceId: id })
        .addSelect(['services.createdAt'])
        .getOne();
    }

    return qb.getMany();
  }
}

@EntityRepository(PermissionEntity)
export class PermissionRepository extends BaseRepository<PermissionEntity> {
  async checkPermission(
    roleId: string,
    serviceId: string,
    type: string,
  ): Promise<any> {
    const qb = this.createQueryBuilder('permission')
      .leftJoin('permission.service', 'services')
      .leftJoin('permission.role', 'roles')
      .where('roles.id = :roleId', { roleId })
      .andWhere('services.id = :serviceId', { serviceId })
      .andWhere('type = :type', { type });

    return !!(await qb.getCount());
  }

  async createPermission(payload: PermissionEntity): Promise<PermissionEntity> {
    const deleteQb = this.createQueryBuilder()
      .delete()
      .from(PermissionEntity)
      .where('service = :serviceId', { serviceId: payload.service.id })
      .andWhere('role = :roleId', { roleId: payload.role.id });

    if (payload.type === PermissionEnum.ALL) {
      await deleteQb.execute();
    }

    await deleteQb
      .andWhere('type = :type', { type: PermissionEnum.ALL })
      .execute();

    return this.save(payload);
  }

  async deletePermission(
    roleId: string,
    permissionId: string,
  ): Promise<string> {
    const deleteQb = this.createQueryBuilder()
      .delete()
      .from(PermissionEntity)
      .where('role = :roleId', { roleId })
      .andWhere('id = :permissionId', { permissionId });

    return this.queryBuilderDelete(deleteQb);
  }
}
