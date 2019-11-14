import {
  Controller, Get, Req, UseGuards, 
} from '@nestjs/common';
import { Request } from 'express'; // eslint-disable-line
import { ApiBearerAuth, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import UserService from './user.service';
import { UserDTO } from './user.dto';

@ApiUseTags('Accounts')
@Controller('account')
export default class UserController {
  constructor(private readonly userService: UserService) {}

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
  @Get()
  async findAll(): Promise<UserDTO[]> {
    return this.userService.findAll();
  }

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
  @Get('profile')
  async profile(@Req() req: Request): Promise<UserDTO> {
    return this.userService.findOne(req.user['id']);
  }
}
