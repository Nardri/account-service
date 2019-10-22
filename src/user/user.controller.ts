import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';

import UserService from './user.service';
import { UserDTO } from './dto/user.dto';
import AuthSchemas from '../validations/auth.validation';

@ApiUseTags('Accounts')
@Controller('account')
export default class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get()
  async findAll(): Promise<UserDTO[]> {
    return this.userService.findAll();
  }

  @Post('signup')
  async signUp(@Body() payload: UserDTO): Promise<UserDTO> {
    const { error, value: validatedPayload } = AuthSchemas
      .signUp
      .validate(payload);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return this.userService.signUp(validatedPayload);
  }
}
