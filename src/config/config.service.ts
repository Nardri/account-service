import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as Joi from '@hapi/joi';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { JwtModuleOptions } from '@nestjs/jwt';

export interface EnvConfig {
  [key: string]: string;
}

export default class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = ConfigService.validateInput(config);
  }

  /**
   * Ensures all needed variables are set,
   * and returns the validated JavaScript object
   * including the applied default values.
   */
  private static validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
      PORT: Joi.number().default(3000),
      POSTGRES_DATABASE_URI: Joi.string().required(),
      DEV_POSTGRES_DATABASE_URI: Joi.string(),
      TEST_POSTGRES_DATABASE_URI: Joi.string().required(),
      APP_SECRET: Joi.string().required(),
      SYNCHRONIZE_DB: Joi.boolean().default(false),
      LOGGING: Joi.boolean().default(false),
      JWT_EXPIRE_IN: Joi.string().default('1h'),
      JWT_ISSUER: Joi.string().default('Account-Service'),
      JWT_SUBJECT: Joi.string().default('Authorization'),
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
    );

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  get(key: string): string {
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
    const env = this.get('NODE_ENV');
    switch (env) {
      case 'test':
        return this.get('TEST_POSTGRES_DATABASE_URI');

      case 'development':
        return this.get('DEV_POSTGRES_DATABASE_URI')
          ? this.get('DEV_POSTGRES_DATABASE_URI')
          : this.get('POSTGRES_DATABASE_URI');

      default:
        return this.get('POSTGRES_DATABASE_URI');
    }
  }

  getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      url: this.getDatabaseURI(),
      entities: [this.getEntitiesPath()],
      migrationsTableName: 'migration',
      migrations: [this.getMigrationPath()],
      synchronize: Boolean(this.get('SYNCHRONIZE_DB')),
      logging: this.isProduction() ? false : Boolean(this.get('LOGGING')),
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
}
