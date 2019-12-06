import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import UserService from './user.service';
import { UserDTO } from './user.dto';

@ApiUseTags('Accounts')
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
}
