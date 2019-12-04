import { Test, TestingModule } from '@nestjs/testing';

import ConfigService from '../config.service';
import { errorCodesObject, messageCodeObject } from '../config.constants';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: new ConfigService(
            '.env',
            errorCodesObject,
            messageCodeObject,
          ),
        },
      ],
    }).compile();

    service = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return typeORM config ', async () => {
    const expected = {
      type: 'postgres',
      url: service.getDatabaseURI(),
      entities: [service.getEntitiesPath()],
      migrationsTableName: 'migration',
      migrations: [service.getMigrationPath()],
      synchronize: service.get('SYNCHRONIZE_DB'),
      logging: service.get('LOGGING'),
      logger: 'advanced-console',
      cli: {
        entitiesDir: 'src/entities',
        migrationsDir: 'src/migration',
      },
    };

    expect(service.getTypeOrmConfig()).toStrictEqual(expected);
  });

  it('should return JWT config ', async () => {
    const expected = {
      secret: service.get('APP_SECRET'),
      signOptions: {
        expiresIn: service.get('JWT_EXPIRE_IN'),
        issuer: service.get('JWT_ISSUER'),
        subject: service.get('JWT_SUBJECT'),
      },
    };

    expect(service.getJWTConfig()).toStrictEqual(expected);
  });
});
