import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import AccessControlController from '../access-control.controller';
import AccessControlService from '../access-control.service';
import {
  PermissionRepository,
  RoleRepository,
  ServicesRepository,
} from '../access-control.repository';
import {
  configServiceMsgMock,
  repositoryMockFactory,
} from '../../../e2e/mocksAndUtils';
import AccessControlSchemas from '../access-control.validation';
import { PermissionDTO, RoleDTO, ServiceDTO } from '../access-control.dto';
import { PermissionEnum } from '../permissions.entity';
import AccessControlUtilities from '../utils';
import RoleEntity from '../roles.entity';
import ServicesEntity from '../services.entity';
import ConfigService from '../../config/config.service';

describe('AccessControl Controller', () => {
  let controller: AccessControlController;
  let service: AccessControlService;
  let configService: ConfigService;
  let newRole: RoleDTO;
  let newService: ServiceDTO;
  let newPermission: PermissionDTO;
  let roleEntity: RoleEntity;
  let serviceEntity: ServicesEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessControlController],
      providers: [
        AccessControlService,
        AccessControlUtilities,
        AccessControlSchemas,
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
    controller = module.get<AccessControlController>(AccessControlController);
    service = module.get<AccessControlService>(AccessControlService);

    roleEntity = new RoleEntity();
    roleEntity.id = '-LuU4ML0DY2_dRK8hsJ3';
    roleEntity.name = 'admin';

    serviceEntity = new ServicesEntity();
    serviceEntity.id = '-LuU4ML0DY2_dRK8hsJ6';
    serviceEntity.name = 'USER_SERVICE';

    newRole = new RoleDTO();
    newRole.name = 'super-user';

    newService = new ServiceDTO();
    newService.name = 'TEST_SERVICE';

    newPermission = new PermissionDTO();
    newPermission.type = PermissionEnum.ALL; // eslint-disable-next-line @typescript-eslint/camelcase
    newPermission.service_id = '-LuU4ML0DY2_dRK87482';
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('Role', () => {
    it('should return a new user role', async () => {
      const res = await controller.addRole(newRole);
      expect(res).toBeInstanceOf(Object);
      expect(res).toHaveProperty('data');
      expect(res.data).toHaveProperty('name');
      expect(res.data['name']).toBe(newRole.name);
    });

    it('should throw an error if the name is invalid', async () => {
      newRole.name = 'admin user';
      try {
        await controller.addRole(newRole);
      } catch (err) {
        expect(err.message).toBeInstanceOf(Object);
        expect(err.message.message).toBe(configService.getErrorMsg('USR_10'));
      }
    });

    it('should throw an error if the name is empty', async () => {
      newRole.name = '';
      try {
        await controller.addRole(newRole);
      } catch (err) {
        expect(err.message).toBeInstanceOf(Object);
        expect(err.message.message).toBe(configService.getErrorMsg('USR_13'));
      }
    });

    it('should return an array of roles.', async () => {
      const queries = {
        include: 'permission',
      };

      const expected = {
        data: [roleEntity],
      };

      jest.spyOn(service, 'getRole').mockResolvedValue(expected);
      const res = await controller.getRoles(queries);
      expect(res).toBeInstanceOf(Object);
      expect(res).toHaveProperty('data');
      expect(res.data).toBeInstanceOf(Array);
      expect(res.data[0].name).toBe(roleEntity.name);
    });

    it('should return a single role.', async () => {
      const queries = {
        include: 'permission',
      };

      const params = {
        roleId: roleEntity.id,
      };

      const expected = {
        data: roleEntity,
      };

      jest.spyOn(service, 'getRole').mockResolvedValue(expected);
      const res = await controller.getRole(queries, params);
      expect(res).toBeInstanceOf(Object);
      expect(res).toHaveProperty('data');
      expect(res.data['name']).toBe(roleEntity.name);
    });

    it('should successfully update a single role.', async () => {
      const params = {
        roleId: roleEntity.id,
      };

      const expected = {
        data: configService.getMsg('USR_MSG_01'),
      };

      jest.spyOn(service, 'updateServiceOrRole').mockResolvedValue(expected);
      const res = await controller.updateRole(newRole, params);
      expect(res).toBeInstanceOf(Object);
      expect(res).toHaveProperty('data');
      expect(res).toBe(expected);
    });

    it(
      'should successfully delete a single role and also '
        + 'delete permissions for a role',
      async () => {
        const params = {
          roleId: roleEntity.id,
        };

        const expected = {
          data: configService.getMsg('USR_MSG_02'),
        };

        jest.spyOn(service, 'deleteRole').mockResolvedValue(expected);
        jest
          .spyOn(service, 'deleteAPermissionForARole')
          .mockResolvedValue(expected);
        const res = await controller.deleteRole(params);
        const resI = await controller.deletePermissionForARole(params);
        expect(res).toBeInstanceOf(Object);
        expect(res).toHaveProperty('data');
        expect(res).toBe(expected);
        expect(resI).toBeInstanceOf(Object);
        expect(resI).toHaveProperty('data');
        expect(resI).toBe(expected);
      },
    );
  });

  describe('Permission', () => {
    it('should not be able to add permission to a role with invalid role id.', async () => {
      const param = {
        roleId: '-invalid-id',
      };
      try {
        await controller.addPermissionToARole(param, newPermission);
      } catch (err) {
        expect(err.message).toBeInstanceOf(Object);
        expect(err.message.message).toBe(configService.getErrorMsg('USR_15'));
      }
    });

    it('should not be able to add permission with invalid permission type.', async () => {
      const param = {
        roleId: '-LuU4ML0DY2_dRK8f8O4',
      };
      try {
        // eslint-disable-next-line @typescript-eslint/camelcase
        newPermission.service_id = 'invalid';
        await controller.addPermissionToARole(param, newPermission);
      } catch (err) {
        expect(err.message).toBeInstanceOf(Object);
        expect(err.message.message).toBe(configService.getErrorMsg('USR_15'));
      }
    });

    it('should be able to add permission to a role with invalid role id.', async () => {
      const param = {
        roleId: '-LuU4ML0DY2_dRK8f8O4',
      };
      const res = await controller.addPermissionToARole(param, newPermission);
      expect(res).toBeInstanceOf(Object);
      expect(res).toHaveProperty('data');
      expect(res.data).toHaveProperty('type');
      expect(res.data['type']).toBe(PermissionEnum.ALL);
    });
  });

  describe('Service', () => {
    it('should not be able to add service.', async () => {
      const res = await controller.addServices(newService);
      expect(res).toBeInstanceOf(Object);
      expect(res).toHaveProperty('data');
      expect(res.data).toHaveProperty('name');
      expect(res.data['name']).toBe(newService.name);
    });

    it('should not be able to add service with invalid name', async () => {
      try {
        newService.name = '';
        await controller.addServices(newService);
      } catch (err) {
        expect(err.message).toBeInstanceOf(Object);
        expect(err.message.message).toBe(configService.getErrorMsg('USR_13'));
      }
    });

    it('should return an array of services.', async () => {
      const queries = {
        include: 'permission',
      };

      const expected = {
        data: [serviceEntity],
      };

      jest.spyOn(service, 'getServices').mockResolvedValue(expected);
      const res = await controller.getServices(queries);
      expect(res).toBeInstanceOf(Object);
      expect(res).toHaveProperty('data');
      expect(res.data).toBeInstanceOf(Array);
      expect(res.data[0].name).toBe(serviceEntity.name);
    });

    it('should return a single service.', async () => {
      const queries = {
        include: 'permission',
      };

      const params = {
        serviceId: serviceEntity.id,
      };

      const expected = {
        data: serviceEntity,
      };

      jest.spyOn(service, 'getServices').mockResolvedValue(expected);
      const res = await controller.getService(queries, params);
      expect(res).toBeInstanceOf(Object);
      expect(res).toHaveProperty('data');
      expect(res.data['name']).toBe(serviceEntity.name);
    });

    it('should successfully update a single role.', async () => {
      const params = {
        serviceId: serviceEntity.id,
      };

      const expected = {
        data: configService.getMsg('USR_MSG_01'),
      };

      jest.spyOn(service, 'updateServiceOrRole').mockResolvedValue(expected);
      const res = await controller.updateService(newRole, params);
      expect(res).toBeInstanceOf(Object);
      expect(res).toHaveProperty('data');
      expect(res).toBe(expected);
    });

    it('should successfully delete a single service.', async () => {
      const params = {
        serviceId: serviceEntity.id,
      };

      const expected = {
        data: configService.getMsg('USR_MSG_02'),
      };

      jest.spyOn(service, 'deleteService').mockResolvedValue(expected);

      const res = await controller.deleteService(params);
      expect(res).toBeInstanceOf(Object);
      expect(res).toHaveProperty('data');
      expect(res).toBe(expected);
    });
  });
});
