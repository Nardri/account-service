import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiUseTags } from '@nestjs/swagger';

import AppService from './app.service';

@Controller()
export default class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiUseTags('App')
  @Get('/health')
  @ApiResponse({ status: 200, description: 'API health check' })
  async health(): Promise<object> {
    return this.appService.health();
  }
}
