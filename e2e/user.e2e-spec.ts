import { INestApplication } from '@nestjs/common';
import { Connection } from 'typeorm';

import { closeAppAndDropDB, createAndMigrateApp, registerTestUser } from './mocksAndUtils';
import loadFixtures from './fixtures/loader';
import ConfigService from '../src/config/config.service';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let configService: ConfigService;
  let user: any;

  beforeEach(async () => {
    app = await createAndMigrateApp();
    const connection = app.get(Connection);
    await loadFixtures('profiles', connection);
    await loadFixtures('users', connection);
    // await loadFixtures('roles', connection);

    configService = app.get<ConfigService>(ConfigService);
    user = await registerTestUser(app, 'testuser@gmail.com');
  });

  afterEach(async () => {
    await closeAppAndDropDB(app);
  });

  it('/account/users  (GET) - Succeeds', async (done) => {
    expect(true).toBe(true);
    done()
  });
});
