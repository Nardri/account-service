import {
  Controller, Get, Req, UseGuards, 
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Request } from 'express';

import ProfileService from './profile.service';
import { ProfileDTO } from './profile.dto';

@Controller('profile')
export default class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

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
  async profile(@Req() req: Request): Promise<ProfileDTO> {
    return this.profileService.getProfile(req.user['id']);
  }
}
