import { Module, Global } from '@nestjs/common';

import ConfigService from './config.service';

@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService('.env'),
    },
  ],
  exports: [ConfigService],
})
export default class ConfigModule {}
