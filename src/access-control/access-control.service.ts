import { Injectable } from '@nestjs/common';

import {
  PermissionRepository,
  RoleRepository,
  ServicesRepository,
} from './access-control.repository';
import {
  AccessControlResponse,
  PermissionDTO,
  RoleDTO,
  ServiceDTO,
} from './access-control.dto';
import RoleEntity from './roles.entity';
import ServicesEntity from './services.entity';
import PermissionEntity from './permissions.entity';
import {
  TObject,
  TRoleEntity,
  TServicesEntity,
} from '../shared/base/base.type';
import AccessControlUtilities from './utils';

@Injectable()
export default class AccessControlService {
  constructor(
    private readonly roleRepo: RoleRepository,
    private readonly serviceRepo: ServicesRepository,
    private readonly permissionRepo: PermissionRepository,
    private readonly utils: AccessControlUtilities,
  ) {}

  /**
   * Gets all roles or a single role.
   * Also the permissions can be included in the response if the query param
   * "?include=permission" is included with the the request
   */
  async getRole(
    includes: string[],
    id?: string,
  ): Promise<AccessControlResponse> {
    let roles: TRoleEntity;
    if (includes.includes('permission')) {
      roles = await this.roleRepo.getRoles(id);
    } else if (id) {
      roles = await this.roleRepo.findOneOrFail(id);
    } else {
      roles = await this.roleRepo.find({
        order: {
          createdAt: 'DESC',
        },
      });
    }

    return this.utils.accessControlResponse(roles);
  }

  async deleteRole(id: string): Promise<AccessControlResponse> {
    const response = await this.roleRepo.delete(id);
    return this.utils.accessControlResponse(response);
  }

  async deleteAPermissionForARole(
    params: TObject,
  ): Promise<AccessControlResponse> {
    const response = await this.permissionRepo.deletePermission(
      params.roleId,
      params.permissionId,
    );
    return this.utils.accessControlResponse(response);
  }

  /**
   * Service to create a either a service or role
   */
  async createServiceOrRole(
    payload: ServiceDTO | RoleDTO, // eslint-disable-next-line @typescript-eslint/tslint/config
    role = false,
  ): Promise<AccessControlResponse> {
    let newObj: any;

    if (!role && !(payload instanceof RoleDTO)) {
      newObj = new ServicesEntity();
      newObj.name = payload.name;

      return this.utils.saveRoleOrServiceEntities(this.serviceRepo, newObj);
    }

    newObj = new RoleEntity();
    newObj.name = payload.name;

    return this.utils.saveRoleOrServiceEntities(this.roleRepo, newObj);
  }

  /**
   * Service to update a either a service or role
   */
  async updateServiceOrRole(
    id: string,
    payload: ServiceDTO | RoleDTO, // eslint-disable-next-line @typescript-eslint/tslint/config
    role = false,
  ): Promise<AccessControlResponse> {
    let newObj: any;

    if (!role && !(payload instanceof RoleDTO)) {
      newObj = new ServicesEntity();
      newObj.name = payload.name;
      newObj.isActive = payload.isActive;

      return this.utils.updateRoleOrServiceEntities(
        id,
        this.serviceRepo,
        newObj,
      );
    }

    newObj = new RoleEntity();
    newObj.name = payload.name;
    return this.utils.updateRoleOrServiceEntities(id, this.roleRepo, newObj);
  }

  /**
   * Gets all services
   * Also the permissions can be included in the response if the query param
   * "?include=permission" is included with the the request
   */
  async getServices(
    includes: string[],
    id?: string,
  ): Promise<AccessControlResponse> {
    let services: TServicesEntity;
    if (includes.includes('permission')) {
      services = await this.serviceRepo.getServices(id);
    } else if (id) {
      services = await this.serviceRepo.findOneOrFail(id);
    } else {
      services = await this.serviceRepo.find({
        select: ['id', 'name', 'isActive'],
        order: {
          createdAt: 'DESC',
        },
      });
    }

    return this.utils.accessControlResponse(services);
  }

  async deleteService(id: string): Promise<AccessControlResponse> {
    const response = await this.serviceRepo.delete(id);
    return this.utils.accessControlResponse(response);
  }

  /**
   * Add permissions to a service and a role.
   */
  async createPermission(
    payload: PermissionDTO,
    roleId: string,
  ): Promise<AccessControlResponse> {
    const newPermission = new PermissionEntity();

    const { role, service } = await this.utils.getAndValidateServiceAndRole(
      roleId,
      payload.service_id,
    );
    newPermission.type = payload.type;
    newPermission.role = role;
    newPermission.service = service;

    await this.utils.checkPermissions(payload, role, service);

    const permission = await this.permissionRepo.createPermission(
      newPermission,
    );

    return this.utils.accessControlResponse(permission);
  }
}
