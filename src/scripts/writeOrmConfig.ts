import * as fs from 'fs';
import * as path from 'path';

import ConfigService from '../config/config.service';

class WriteOrmConfig {
  constructor(private readonly config: ConfigService) {
  }

  write(): void {
    fs.writeFileSync(
      'ormconfig.json',
      JSON.stringify(this.config.getTypeOrmConfig(), this.replacer, 2),
    );
  }

  /*eslint-disable */
  replacer(key: any, value: any): any {
    const entityPath = path.join(__dirname, '..', '**/*.entity{.ts,.js}');
    const migrationPath = path.join(__dirname, '..', 'migration/**/*{.ts,.js}');
    const subscriberPath = path.join(__dirname, '..', '**/*.subscriber{.ts,.js}');
    for (const prop in value) {
      if (Object.prototype.hasOwnProperty.call(value, prop)) {
        switch (prop) {
          case 'entities':
            value[prop] = [entityPath];
            break;

          case 'migrations':
            value[prop] = [migrationPath];
            break;

          case 'subscribers':
            value[prop] = [subscriberPath];
            break;

          default:
            break;
        }
      }
    }
    return value;
  }

  /* eslint-enable */
}

new WriteOrmConfig(
  new ConfigService(`${process.env.NODE_ENV || 'development'}.env`),
).write();
