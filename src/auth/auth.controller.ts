import {
  BadRequestException, Body, Controller, Post, 
} from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';

import { UserDTO } from '../user/user.dto';
import AuthSchemas from './auth.validation';
import AuthService from './auth.service';
import { AuthResponse } from './auth.dto';

@ApiUseTags('Authorization')
@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() payload: UserDTO): Promise<AuthResponse> {
    const { error, value: validatedPayload } = AuthSchemas.signUp.validate(
      payload,
    );

    if (error) {
      throw new BadRequestException(error.message);
    }

    return this.authService.signUp(validatedPayload);
  }
}
