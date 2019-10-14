import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as Joi from '@hapi/joi';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

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
      APP_SECRET: Joi.string().required(),
      SYNCHRONIZE_DB: Joi.boolean(),
      LOGGING: Joi.boolean(),
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
    );

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  private get(key: string): string {
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

  getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      url: this.get('POSTGRES_DATABASE_URI'),
      entities: [this.getEntitiesPath()],
      migrationsTableName: 'migration',
      migrations: [this.getMigrationPath()],
      synchronize: Boolean(this.get('SYNCHRONIZE_DB')),
      logging: Boolean(this.get('LOGGING')),
      logger: 'advanced-console',
      cli: {
        entitiesDir: 'src/entities',
        migrationsDir: 'src/migration',
      },
    };
  }
}
