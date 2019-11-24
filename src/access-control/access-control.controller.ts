import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiImplicitParam,
  ApiImplicitQuery,
  ApiUseTags,
} from '@nestjs/swagger';

import {
  AccessControlResponse,
  PermissionDTO,
  RoleDTO,
  ServiceDTO,
} from './access-control.dto';
import AccessControlSchemas from './access-control.validation';
import AccessControlService from './access-control.service';
import { convertQueryParamToArray, validateWithJoi } from '../shared/util';
import { TObject } from '../shared/base/base.type';

@ApiUseTags('Access Control')
@Controller('management')
export default class AccessControlController {
  constructor(
    private readonly accessControlService: AccessControlService,
    private readonly accessControlSchemas: AccessControlSchemas,
  ) {}

  @Post('role')
  async addRole(@Body() payload: RoleDTO): Promise<AccessControlResponse> {
    const validatedPayload = validateWithJoi(
      payload,
      this.accessControlSchemas.role,
    );
    return this.accessControlService.createServiceOrRole(
      validatedPayload,
      true,
    );
  }

  @ApiImplicitParam({
    name: 'roleId',
    required: true,
    description: 'Role ID',
  })
  @Post('role/:roleId/permission')
  async addPermissionToARole(
    @Param() params: TObject,
    @Body() payload: PermissionDTO,
  ): Promise<AccessControlResponse> {
    const validatedParam = validateWithJoi(
      params,
      this.accessControlSchemas.roleParams,
    );
    const validatedPayload = validateWithJoi(
      payload,
      this.accessControlSchemas.permission,
    );

    return this.accessControlService.createPermission(
      validatedPayload,
      validatedParam.roleId,
    );
  }

  @ApiImplicitQuery({
    name: 'include',
    required: false,
    enum: ['permission'],
  })
  @Get('role')
  async getRoles(@Query() queries: TObject): Promise<AccessControlResponse> {
    const includedQuery = convertQueryParamToArray(queries);
    return this.accessControlService.getRole(includedQuery);
  }

  @ApiImplicitQuery({
    name: 'include',
    required: false,
    enum: ['permission'],
  })
  @ApiImplicitParam({
    name: 'roleId',
    required: true,
    description: 'Role ID',
  })
  @Get('role/:roleId')
  async getRole(
    @Query() queries: TObject,
    @Param() params: TObject,
  ): Promise<AccessControlResponse> {
    const validatedParam = validateWithJoi(
      params,
      this.accessControlSchemas.roleParams,
    );
    const includedQuery = convertQueryParamToArray(queries);
    return this.accessControlService.getRole(
      includedQuery,
      validatedParam.roleId,
    );
  }

  @ApiImplicitParam({
    name: 'roleId',
    required: true,
    description: 'Role ID',
  })
  @Patch('role/:roleId')
  async updateRole(
    @Body() payload: RoleDTO,
    @Param() params: TObject,
  ): Promise<AccessControlResponse> {
    const validatedParam = validateWithJoi(
      params,
      this.accessControlSchemas.roleParams,
    );

    const validatedPayload = validateWithJoi(
      payload,
      this.accessControlSchemas.role,
    );

    return this.accessControlService.updateServiceOrRole(
      validatedParam.roleId,
      validatedPayload,
      true,
    );
  }

  @ApiImplicitParam({
    name: 'roleId',
    required: true,
    description: 'Role ID',
  })
  @Delete('role/:roleId')
  async deleteRole(@Param() params: TObject): Promise<AccessControlResponse> {
    const validatedParam = validateWithJoi(
      params,
      this.accessControlSchemas.roleParams,
    );
    return this.accessControlService.deleteRole(validatedParam.roleId);
  }

  @ApiImplicitParam({
    name: 'roleId',
    required: true,
    description: 'Role ID',
  })
  @ApiImplicitParam({
    name: 'permissionId',
    required: true,
    description: 'Permission ID',
  })
  @Delete('role/:roleId/permission/:permissionId')
  async deletePermissionForARole(
    @Param() params: TObject,
  ): Promise<AccessControlResponse> {
    const validatedParam = validateWithJoi(
      params,
      this.accessControlSchemas.roleParams,
    );
    return this.accessControlService.deleteAPermissionForARole(validatedParam);
  }

  @Post('service')
  async addServices(
    @Body() payload: ServiceDTO,
  ): Promise<AccessControlResponse> {
    const validatedPayload = validateWithJoi(
      payload,
      this.accessControlSchemas.service,
    );

    return this.accessControlService.createServiceOrRole(validatedPayload);
  }

  @ApiImplicitQuery({
    name: 'include',
    required: false,
    enum: ['permission'],
  })
  @Get('service')
  async getServices(@Query() queries: TObject): Promise<AccessControlResponse> {
    const includedQuery = convertQueryParamToArray(queries);
    return this.accessControlService.getServices(includedQuery);
  }

  @ApiImplicitQuery({
    name: 'include',
    required: false,
    enum: ['permission'],
  })
  @ApiImplicitParam({
    name: 'serviceId',
    required: true,
    description: 'Service ID',
  })
  @Get('service/:serviceId')
  async getService(
    @Query() queries: TObject,
    @Param() params: TObject,
  ): Promise<AccessControlResponse> {
    const validatedParam = validateWithJoi(
      params,
      this.accessControlSchemas.serviceParams,
    );
    const includedQuery = convertQueryParamToArray(queries);
    return this.accessControlService.getServices(
      includedQuery,
      validatedParam.serviceId,
    );
  }

  @ApiImplicitParam({
    name: 'serviceId',
    required: true,
    description: 'Service ID',
  })
  @Patch('service/:serviceId')
  async updateService(
    @Body() payload: ServiceDTO,
    @Param() params: TObject,
  ): Promise<AccessControlResponse> {
    const validatedParam = validateWithJoi(
      params,
      this.accessControlSchemas.serviceParams,
    );

    const validatedPayload = validateWithJoi(
      payload,
      this.accessControlSchemas.service,
    );

    return this.accessControlService.updateServiceOrRole(
      validatedParam.serviceId,
      validatedPayload,
    );
  }

  @ApiImplicitParam({
    name: 'serviceId',
    required: true,
    description: 'Service ID',
  })
  @Delete('service/:serviceId')
  async deleteService(
    @Param() params: TObject,
  ): Promise<AccessControlResponse> {
    const validatedParam = validateWithJoi(
      params,
      this.accessControlSchemas.serviceParams,
    );
    return this.accessControlService.deleteService(validatedParam.serviceId);
  }
}
