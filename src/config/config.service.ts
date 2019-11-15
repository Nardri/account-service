import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { JwtModuleOptions } from '@nestjs/jwt';
import { IOAuth2StrategyOptionWithRequest } from 'passport-google-oauth';
import { ExtractJwt, StrategyOptions } from 'passport-jwt';

export interface EnvConfig {
  [key: string]: string;
}

interface IScope {
  scope: string | string[];
}

export default class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = ConfigService.evalDotEnv(config);
  }

  private static evalDotEnv(data: any): any {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        switch (data[key]) {
          case 'true' || 'True' || '1':
            data[key] = true;
            break;
          case 'false' || 'False' || '0':
            data[key] = false;
            break;
          case 'null' || '':
            data[key] = null;
            break;
          default:
            break;
        }
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(Number(key))) {
          data[key] = Number(key);
        }
      }
    }
    return data;
  }

  get(key: string): any {
    return this.envConfig[key];
  }

  isProduction(): boolean {
    return this.envConfig['NODE_ENV'] === 'production';
  }

  getEntitiesPath(): string {
    return path.join(__dirname, '..', '**/*.entity{.ts,.js}');
  }

  getMigrationPath(): string {
    return path.join(__dirname, '..', 'migration/**/*{.ts,.js}');
  }

  getDatabaseURI(): string {
    if (process.env.NODE_ENV === 'test') {
      return this.get('TEST_POSTGRES_DATABASE_URI');
    }
    return this.get('POSTGRES_DATABASE_URI');
  }

  getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      url: this.getDatabaseURI(),
      entities: [this.getEntitiesPath()],
      migrationsTableName: 'migration',
      migrations: [this.getMigrationPath()],
      synchronize: this.get('SYNCHRONIZE_DB'),
      logging: this.isProduction() ? false : this.get('LOGGING'),
      logger: 'advanced-console',
      cli: {
        entitiesDir: 'src/entities',
        migrationsDir: 'src/migration',
      },
    };
  }

  getJWTConfig(): JwtModuleOptions {
    return {
      secret: this.get('APP_SECRET'),
      signOptions: {
        expiresIn: this.get('JWT_EXPIRE_IN'),
        issuer: this.get('JWT_ISSUER'),
        subject: this.get('JWT_SUBJECT'),
      },
    };
  }

  getGoogleStrategyOptions(): IOAuth2StrategyOptionWithRequest & IScope {
    return {
      clientID: this.get('GOOGLE_CLIENT_ID'),
      clientSecret: this.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: this.get('GOOGLE_CALLBACK_URL'),
      passReqToCallback: true,
      scope: ['profile', 'email'],
    };
  }

  getJwtStrategyOptions(): StrategyOptions {
    return {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: this.get('APP_SECRET'),
    };
  }
}
