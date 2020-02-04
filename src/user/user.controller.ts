import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
// import {
//   Ctx,
//   EventPattern,
//   Payload,
//   RmqContext,
// } from '@nestjs/microservices';

import UserService from './user.service';
import { UserDTO } from './user.dto';

@ApiTags('Accounts')
@Controller('account')
export default class UserController {
  constructor(
    private readonly userService: UserService, // private readonly userSchema: UserSchemas,
  ) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully fetched.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('users')
  async findAll(): Promise<UserDTO[]> {
    return this.userService.findAll();
  }

  // @EventPattern('default.user.role.fetched')
  // async handleUserRoleAssignment(@Payload() data: Record<string, unknown>, @Ctx() context: RmqContext): Promise<any> {
  //   const channel = context.getChannelRef();
  //   const messsage = context.getMesssage();
  //   // console.log(messsage.fields);
  //   // console.log(data);
  //   // channel.ack(messsage);
  // }
}
