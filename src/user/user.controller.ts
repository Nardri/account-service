import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
// import { Ctx, EventPattern, Payload } from '@nestjs/microservices';

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

  // @EventPattern('nadri.account.role.default')
  // async handleUserRoleAssignment(@Payload() _data: Record<string, unknown>, @Ctx() context: any): Promise<any> {
  //   const channel = context.getChannelRef();
  //   const message = context.getMessage();
  //   channel.ack(message);
  // }
}
