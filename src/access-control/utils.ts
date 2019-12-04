import { Repository } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

import {
  AccessControlEntities,
  TRoleServiceEntities,
} from '../shared/base/base.type';
import { AccessControlResponse, PermissionDTO } from './access-control.dto';
import {
  PermissionRepository,
  RoleRepository,
  ServicesRepository,
} from './access-control.repository';
import { IRoleService } from '../shared/base/base.interface';
import RoleEntity from './roles.entity';
import ServicesEntity from './services.entity';
import { PermissionEnum } from './permissions.entity';
import ConfigService from '../config/config.service';

@Injectable()
export default class AccessControlUtilities {
  constructor(
    private readonly roleRepo: RoleRepository,
    private readonly permissionRepo: PermissionRepository,
    private readonly serviceRepo: ServicesRepository,
    private readonly configService: ConfigService,
  ) {}

  /**
   * access control Response method
   */
  accessControlResponse(
    data: AccessControlEntities | string,
  ): AccessControlResponse {
    return {
      data,
    } as AccessControlResponse;
  }

  /**
   * Helper method to help check if either a role or a service exists
   */
  async getAndValidateServiceAndRole(
    roleId: string,
    serviceId: string,
  ): Promise<IRoleService> {
    const role: RoleEntity = await this.roleRepo.findOneOrFail(roleId);
    const service: ServicesEntity = await this.serviceRepo.findOneOrFail(
      serviceId,
      {
        where: {
          isActive: true,
        },
      },
    );

    if (!service) {
      throw new BadRequestException(this.configService.getErrorMsg('PERM_03'));
    }

    if (!role) {
      throw new BadRequestException(this.configService.getErrorMsg('PERM_04'));
    }

    return {
      role,
      service,
    };
  }

  /**
   * Helper method to help check if a role already has all permissions
   * and also if a role has the permission that is about to be created.
   */
  async checkPermissions(
    payload: PermissionDTO,
    role: RoleEntity,
    service: ServicesEntity,
  ): Promise<void> {
    const alreadyHaveThisPermission = await this.permissionRepo.checkPermission(
      role.id,
      service.id,
      payload.type,
    );
    const haveAllPermission = await this.permissionRepo.checkPermission(
      role.id,
      service.id,
      PermissionEnum.ALL,
    );

    if (haveAllPermission && payload.type === PermissionEnum.ALL) {
      throw new ConflictException(this.configService.getErrorMsg('PERM_01'));
    }

    if (alreadyHaveThisPermission) {
      throw new ConflictException(this.configService.getErrorMsg('PERM_02'));
    }
  }

  async saveRoleOrServiceEntities(
    repo: Repository<TRoleServiceEntities>,
    obj: TRoleServiceEntities,
  ): Promise<AccessControlResponse> {
    let value: any;
    try {
      value = await repo.save(obj);
    } catch (err) {
      throw new ConflictException(this.configService.getErrorMsg('USR_09'));
    }
    return this.accessControlResponse(value);
  }

  async updateRoleOrServiceEntities(
    id: string,
    repo: Repository<TRoleServiceEntities>,
    obj: TRoleServiceEntities,
  ): Promise<AccessControlResponse> {
    let value: any;
    try {
      value = await repo.update(id, obj);
    } catch (err) {
      throw new ConflictException(this.configService.getErrorMsg('USR_09'));
    }
    return this.accessControlResponse(value);
  }
}
