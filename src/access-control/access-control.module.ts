import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import AccessControlService from './access-control.service';
import AccessControlController from './access-control.controller';

import {
  RoleRepository,
  PermissionRepository,
  ServicesRepository,
} from './access-control.repository';
import RoleEntity from './roles.entity';
import PermissionEntity from './permissions.entity';
import ServicesEntity from './services.entity';
import UserRepository from '../user/user.repository';
import AccessControlSchemas from './access-control.validation';
import AccessControlUtilities from './utils';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoleEntity,
      PermissionEntity,
      ServicesEntity,
      UserRepository,
      RoleRepository,
      PermissionRepository,
      ServicesRepository,
    ]),
  ],
  providers: [
    AccessControlService,
    AccessControlSchemas,
    AccessControlUtilities,
  ],
  controllers: [AccessControlController],
})
export default class AccessControlModule {}
