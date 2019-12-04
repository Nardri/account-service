import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import AccessControlService from '../access-control.service';
import {
  configServiceMsgMock,
  repositoryMockFactory,
} from '../../../e2e/mocksAndUtils';
import {
  PermissionRepository,
  RoleRepository,
  ServicesRepository,
} from '../access-control.repository';
import AccessControlUtilities from '../utils';
import RoleEntity from '../roles.entity';
import PermissionEntity, { PermissionEnum } from '../permissions.entity';
import ServicesEntity from '../services.entity';
import { PermissionDTO, RoleDTO, ServiceDTO } from '../access-control.dto';
import ConfigService from '../../config/config.service';

describe('AccessControlService', () => {
  let service: AccessControlService;
  let configService: ConfigService;
  let roleRepo: RoleRepository;
  let permissionRepo: PermissionRepository;
  let servicesRepo: ServicesRepository;
  let rolesEntity: RoleEntity;
  let newRole: RoleDTO;
  let newService: ServiceDTO;
  let newPermission: PermissionDTO;
  let permissionEntity: PermissionEntity;
  let servicesEntity: ServicesEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessControlService,
        AccessControlUtilities,
        {
          provide: ConfigService,
          useValue: configServiceMsgMock,
        },
        {
          provide: getRepositoryToken(RoleRepository),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(ServicesRepository),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(PermissionRepository),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
    service = module.get<AccessControlService>(AccessControlService);
    roleRepo = module.get<RoleRepository>(RoleRepository);
    permissionRepo = module.get<PermissionRepository>(PermissionRepository);
    servicesRepo = module.get<ServicesRepository>(ServicesRepository);

    servicesEntity = new ServicesEntity();
    servicesEntity.id = '-random-string-service';
    servicesEntity.name = 'USER_SERVICE';
    servicesEntity.isActive = true;
    servicesEntity.permissions = [permissionEntity];

    permissionEntity = new PermissionEntity();
    permissionEntity.id = '-random-string-perm';
    permissionEntity.type = PermissionEnum.ALL;
    permissionEntity.service = servicesEntity;
    permissionEntity.role = rolesEntity;

    rolesEntity = new RoleEntity();
    rolesEntity.id = '-random-string';
    rolesEntity.name = 'admin';
    rolesEntity.permissions = [permissionEntity];

    newRole = new RoleDTO();
    newRole.name = 'super-user';

    newService = new ServiceDTO();
    newService.name = 'TEST_SERVICE';

    newPermission = new PermissionDTO();
    newPermission.type = PermissionEnum.ALL; // eslint-disable-next-line @typescript-eslint/camelcase
    newPermission.service_id = servicesEntity.id;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Role', () => {
    it('should get all roles created with permission', async () => {
      const includes = ['permission'];
      jest.spyOn(roleRepo, 'getRoles').mockResolvedValue([rolesEntity]);
      expect(service.getRole(includes)).toBeDefined();

      const res = await service.getRole(includes);
      expect(res).toBeInstanceOf(Object);
      expect(res).toHaveProperty('data');
      expect(res.data).toBeInstanceOf(Array);
      expect(res.data[0]).toHaveProperty('id');
      expect(res.data[0]).toHaveProperty('name');
      expect(res.data[0]).toHaveProperty('permissions');
    });

    it('should get all roles created without permission', async () => {
      const includes = [];
      delete rolesEntity.permissions;
      jest.spyOn(roleRepo, 'find').mockResolvedValue([rolesEntity]);
      const res = await service.getRole(includes);

      expect(res).toBeInstanceOf(Object);
      expect(res).toHaveProperty('data');
      expect(res.data).toBeInstanceOf(Array);
      expect(res.data[0]).toHaveProperty('id');
      expect(res.data[0]).toHaveProperty('name');
      expect(res.data[0].permission).toBeUndefined();
    });

    it('should get a single user role', async () => {
      const includes = [];
      delete rolesEntity.permissions;
      jest.spyOn(roleRepo, 'findOneOrFail').mockResolvedValue(rolesEntity);
      const res = await service.getRole(includes, rolesEntity.id);

      expect(res).toBeInstanceOf(Object);
      expect(res).toHaveProperty('data');
      expect(res.data instanceof Array).toBeFalsy();
      expect(res.data).toHaveProperty('id');
      expect(res.data).toHaveProperty('name');
    });

    it('should delete a user role', async () => {
      jest
        .spyOn(roleRepo, 'delete')
        .mockResolvedValue(configService.getErrorMsg('USR_13'));
      const res = await service.deleteRole(rolesEntity.id);

      expect(res).toBeInstanceOf(Object);
      expect(res).toHaveProperty('data');
      expect(res.data).toBe(configService.getErrorMsg('USR_13'));
    });

    it('should delete a permission for a role', async () => {
      jest
        .spyOn(permissionRepo, 'deletePermission')
        .mockResolvedValue(configService.getErrorMsg('USR_13'));
      const params = {
        roleId: rolesEntity.id,
        permissionId: permissionEntity.id,
      };

      const res = await service.deleteAPermissionForARole(params);
      expect(res).toBeInstanceOf(Object);
      expect(res).toHaveProperty('data');
      expect(res.data).toBe(configService.getErrorMsg('USR_13'));
    });

    it('should create a role', async () => {
      const res = await service.createServiceOrRole(newRole);
      expect(res).toBeInstanceOf(Object);
      expect(res).toHaveProperty('data');
      expect(res.data).toHaveProperty('name');
    });

    it('should throw an error if the role already exists.', async () => {
      jest.spyOn(roleRepo, 'save').mockRejectedValue(false);
      try {
        await service.createServiceOrRole(newRole);
      } catch (err) {
        expect(err.message).toBeInstanceOf(Object);
        expect(err.message.message).toBe(configService.getErrorMsg('USR_09'));
      }
    });

    it('should update a role', async () => {
      jest
        .spyOn(roleRepo, 'update')
        .mockResolvedValue(configService.getErrorMsg('USR_16'));
      const res = await service.updateServiceOrRole(
        rolesEntity.id,
        newRole,
        true,
      );

      expect(res).toBeInstanceOf(Object);
      expect(res).toHaveProperty('data');
      expect(res.data).toBe(configService.getErrorMsg('USR_16'));
    });

    it('should throw an error if the role already exists on update.', async () => {
      jest.spyOn(roleRepo, 'update').mockRejectedValue(false);
      try {
        await service.updateServiceOrRole(rolesEntity.id, newService, true);
      } catch (err) {
        expect(err.message).toBeInstanceOf(Object);
        expect(err.message.message).toBe(configService.getErrorMsg('USR_09'));
      }
    });
  });

  describe('Services', () => {
    it('should create a service', async () => {
      const res = await service.createServiceOrRole(newService, false);
      expect(res).toBeInstanceOf(Object);
      expect(res).toHaveProperty('data');
      expect(res.data).toHaveProperty('name');
    });

    it('should update a service', async () => {
      jest
        .spyOn(servicesRepo, 'update')
        .mockResolvedValue(configService.getErrorMsg('USR_16'));
      const res = await service.updateServiceOrRole(
        servicesEntity.id,
        newService,
        false,
      );

      expect(res).toBeInstanceOf(Object);
      expect(res).toHaveProperty('data');
      expect(res.data).toBe(configService.getErrorMsg('USR_16'));
    });

    it('should throw an error if the service already exists on update.', async () => {
      jest.spyOn(servicesRepo, 'update').mockRejectedValue(false);
      try {
        await service.updateServiceOrRole(servicesEntity.id, newService, false);
      } catch (err) {
        expect(err.message).toBeInstanceOf(Object);
        expect(err.message.message).toBe(configService.getErrorMsg('USR_09'));
      }
    });

    it('should throw an error if the service already exists.', async () => {
      jest.spyOn(servicesRepo, 'save').mockRejectedValue(false);
      try {
        await service.createServiceOrRole(newService, false);
      } catch (err) {
        expect(err.message).toBeInstanceOf(Object);
        expect(err.message.message).toBe(configService.getErrorMsg('USR_09'));
      }
    });

    it('should get all service created without permission', async () => {
      const includes = [];
      delete servicesEntity.permissions;
      jest.spyOn(servicesRepo, 'find').mockResolvedValue([servicesEntity]);
      const res = await service.getServices(includes);

      expect(res).toBeInstanceOf(Object);
      expect(res).toHaveProperty('data');
      expect(res.data).toBeInstanceOf(Array);
      expect(res.data[0]).toHaveProperty('id');
      expect(res.data[0]).toHaveProperty('name');
      expect(res.data[0].permission).toBeUndefined();
    });

    it('should get a single service', async () => {
      const includes = [];
      delete servicesEntity.permissions;
      jest
        .spyOn(servicesRepo, 'findOneOrFail')
        .mockResolvedValue(servicesEntity);
      const res = await service.getServices(includes, servicesEntity.id);

      expect(res).toBeInstanceOf(Object);
      expect(res).toHaveProperty('data');
      expect(res.data instanceof Array).toBeFalsy();
      expect(res.data).toHaveProperty('id');
      expect(res.data).toHaveProperty('name');
    });

    it('should delete a user role', async () => {
      jest
        .spyOn(servicesRepo, 'delete')
        .mockResolvedValue(configService.getErrorMsg('USR_13'));
      const res = await service.deleteService(servicesEntity.id);

      expect(res).toBeInstanceOf(Object);
      expect(res).toHaveProperty('data');
      expect(res.data).toBe(configService.getErrorMsg('USR_13'));
    });

    it('should get all roles created with permission', async () => {
      const includes = ['permission'];
      jest
        .spyOn(servicesRepo, 'getServices')
        .mockResolvedValue([servicesEntity]);
      expect(service.getRole(includes)).toBeDefined();

      const res = await service.getServices(includes);
      expect(res).toBeInstanceOf(Object);
      expect(res).toHaveProperty('data');
      expect(res.data).toBeInstanceOf(Array);
      expect(res.data[0]).toHaveProperty('id');
      expect(res.data[0]).toHaveProperty('name');
      expect(res.data[0]).toHaveProperty('permissions');
    });
  });

  describe('Permission', () => {
    it('should create a permission', async () => {
      jest
        .spyOn(servicesRepo, 'findOneOrFail')
        .mockResolvedValue(servicesEntity);

      jest.spyOn(roleRepo, 'findOneOrFail').mockResolvedValue(rolesEntity);

      jest.spyOn(permissionRepo, 'checkPermission').mockResolvedValue(false);

      const res = await service.createPermission(newPermission, rolesEntity.id);
      expect(res).toBeInstanceOf(Object);
      expect(res).toHaveProperty('data');
      expect(res.data).toHaveProperty('type');
      expect(res.data).toHaveProperty('role');
      expect(res.data).toHaveProperty('service');
      expect(res.data['type']).toBe(PermissionEnum.ALL);
      expect(res.data['service']).toBe(servicesEntity);
      expect(res.data['role']).toBe(rolesEntity);
    });

    it('should throw an error when role has all permission already', async () => {
      jest
        .spyOn(servicesRepo, 'findOneOrFail')
        .mockResolvedValue(servicesEntity);

      jest.spyOn(roleRepo, 'findOneOrFail').mockResolvedValue(rolesEntity);

      jest.spyOn(permissionRepo, 'checkPermission').mockResolvedValue(true);
      try {
        await service.createPermission(newPermission, rolesEntity.id);
      } catch (err) {
        expect(err.message).toBeInstanceOf(Object);
        expect(err.message.message).toBe(configService.getErrorMsg('PERM_01'));
      }
    });

    it('should throw an error when role has a permission already', async () => {
      newPermission.type = PermissionEnum.EDIT;

      jest
        .spyOn(servicesRepo, 'findOneOrFail')
        .mockResolvedValue(servicesEntity);

      jest.spyOn(roleRepo, 'findOneOrFail').mockResolvedValue(rolesEntity);

      jest.spyOn(permissionRepo, 'checkPermission').mockResolvedValue(true);
      try {
        await service.createPermission(newPermission, rolesEntity.id);
      } catch (err) {
        expect(err.message).toBeInstanceOf(Object);
        expect(err.message.message).toBe(configService.getErrorMsg('PERM_02'));
      }
    });

    it('should throw an error if the service doesn\'t exist.', async () => {
      jest.spyOn(servicesRepo, 'findOneOrFail').mockResolvedValue(undefined);

      jest.spyOn(roleRepo, 'findOneOrFail').mockResolvedValue(rolesEntity);

      jest.spyOn(permissionRepo, 'checkPermission').mockResolvedValue(true);
      try {
        await service.createPermission(newPermission, rolesEntity.id);
      } catch (err) {
        expect(err.message).toBeInstanceOf(Object);
        expect(err.message.message).toBe(configService.getErrorMsg('PERM_03'));
      }
    });

    it('should throw an error if the role doesn\'t exist.', async () => {
      jest
        .spyOn(servicesRepo, 'findOneOrFail')
        .mockResolvedValue(servicesEntity);

      jest.spyOn(roleRepo, 'findOneOrFail').mockResolvedValue(undefined);

      jest.spyOn(permissionRepo, 'checkPermission').mockResolvedValue(true);
      try {
        await service.createPermission(newPermission, rolesEntity.id);
      } catch (err) {
        expect(err.message).toBeInstanceOf(Object);
        expect(err.message.message).toBe(configService.getErrorMsg('PERM_04'));
      }
    });
  });
});
