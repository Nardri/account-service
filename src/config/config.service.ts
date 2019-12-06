import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { JwtModuleOptions } from '@nestjs/jwt';
import { IOAuth2StrategyOptionWithRequest } from 'passport-google-oauth';
import { ExtractJwt, StrategyOptions } from 'passport-jwt';
import { InternalServerErrorException } from '@nestjs/common';

import { TObject } from '../shared/base/base.type';

interface IScope {
  scope: string | string[];
}

export default class ConfigService {
  private readonly envConfig: TObject;

  private readonly privateKEY: any;

  private readonly publicKEY: any;

  constructor(
    private readonly errorCodes: TObject,
    private readonly messageCodes: TObject,
  ) {
    dotenv.config();
    this.envConfig = process.env;

    // PRIVATE and PUBLIC key
    try {
      this.privateKEY = fs.readFileSync('./privateKey.pem', 'utf8');
      this.publicKEY = fs.readFileSync('./publicKey.pem', 'utf8');
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
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
      secret: this.privateKEY,
      signOptions: {
        expiresIn: this.get('JWT_EXPIRE_IN'),
        issuer: this.get('JWT_ISSUER'),
        subject: this.get('JWT_SUBJECT'),
        algorithm: 'RS512',
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
      secretOrKey: this.publicKEY,
      algorithms: ['RS512'],
    };
  }

  getErrorMsg(key: string): string {
    return this.errorCodes[key] ? this.errorCodes[key] : 'Invalid';
  }

  getMsg(key: string): string {
    return this.messageCodes[key] ? this.messageCodes[key] : 'Invalid';
  }
}
