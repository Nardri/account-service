import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import AppService from './app.service';

@Controller()
export default class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiTags('App')
  @Get('/')
  @ApiResponse({ status: 200, description: 'API health check' })
  async health(): Promise<object> {
    return this.appService.health();
  }
}
