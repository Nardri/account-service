import { ApiModelProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

import { PermissionEnum } from './permissions.entity';
import { ServiceAPIResponse } from '../shared/base/base.interface';
import { AccessControlEntities } from '../shared/base/base.type';

export class RoleDTO implements Readonly<RoleDTO> {
  @ApiModelProperty({ required: true })
  @IsString()
  name: string;
}

export class ServiceDTO implements Readonly<ServiceDTO> {
  @ApiModelProperty({ required: true })
  @IsString()
  name: string;

  @ApiModelProperty({ required: true })
  @IsBoolean()
  isActive?: string;
}

export class PermissionDTO implements Readonly<PermissionDTO> {
  @ApiModelProperty({ required: true })
  @IsString()
  type: PermissionEnum;

  /* eslint-disable */
  @ApiModelProperty({ required: true })
  @IsString()
  service_id: string;
  /* eslint-enable */
}

export class AccessControlResponse extends ServiceAPIResponse<
AccessControlEntities
> {
  data: AccessControlEntities;
}
