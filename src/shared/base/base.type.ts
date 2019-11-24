import RoleEntity from '../../access-control/roles.entity';
import ServicesEntity from '../../access-control/services.entity';
import PermissionEntity from '../../access-control/permissions.entity';

export type TRoleServiceEntities = RoleEntity | ServicesEntity;
export type TPermissionEntity = PermissionEntity | PermissionEntity[];
export type TServicesEntity = ServicesEntity | ServicesEntity[];
export type TRoleEntity = RoleEntity | RoleEntity[];
export type AccessControlEntities =
  | TPermissionEntity
  | TServicesEntity
  | TRoleEntity
  | string;
export type TObject = { [key: string]: any };
