import { Module, Global } from '@nestjs/common';

import ConfigService from './config.service';
import { errorCodesObject, messageCodeObject } from './config.constants';

@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(errorCodesObject, messageCodeObject),
    },
  ],
  exports: [ConfigService],
})
export default class ConfigModule {}
