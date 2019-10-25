import {
  Controller, Get, Req, UseGuards, 
} from '@nestjs/common';
import { Request } from 'express'; // eslint-disable-line
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import UserService from './user.service';
import { UserDTO } from './user.dto';

@ApiUseTags('Accounts')
@Controller('account')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Req() req?: Request): Promise<UserDTO[]> {
    const { user } = req; // eslint-disable-line
    return this.userService.findAll();
  }
}
