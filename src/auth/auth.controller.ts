import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';

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

  @Post('login')
  async login(@Body() payload: UserDTO): Promise<AuthResponse> {
    const { error, value: validatedPayload } = AuthSchemas.login.validate(
      payload,
    );

    if (error) {
      throw new BadRequestException(error.message);
    }

    return this.authService.login(validatedPayload);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(): Promise<void> {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallBack(
    @Req() req: Request & { user: string | any },
    @Res() res: Response,
  ): Promise<any> {
    res.status(200).json({
      accessToken: req.user.data.accessToken,
    });
  }
}
