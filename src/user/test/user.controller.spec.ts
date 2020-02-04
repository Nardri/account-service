import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import UserController from '../user.controller';
import UserService from '../user.service';
import UserEntity from '../user.entity';
import UserRepository from '../user.repository';
import {
  configServiceMsgMock,
  MockType,
  repositoryMockFactory,
  rmqMock,
} from '../../../e2e/mocksAndUtils';
import ProfileRepository from '../../profile/profile.repository';
import ConfigService from '../../config/config.service';
import UserSchemas from '../user.validation';

describe('User Controller without DB Access.', () => {
  let controller: UserController;
  let userService: UserService;
  let repositoryMock: MockType<Repository<UserEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        UserSchemas,
        {
          provide: ConfigService,
          useValue: configServiceMsgMock,
        },
        {
          provide: getRepositoryToken(UserRepository),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(ProfileRepository),
          useFactory: repositoryMockFactory,
        },
        {
          provide: 'RMQ_SERVICE',
          useValue: rmqMock,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    repositoryMock = module.get(getRepositoryToken(UserRepository));
  });

  it('should be defined', async () => {
    expect(await userService).toBeDefined();
    expect(await repositoryMock).toBeDefined();
    expect(await controller).toBeDefined();
  });

  it('should return an array of users', async () => {
    const expected = new UserEntity();
    expected.email = 'test@example.com';

    const result = new Promise<UserEntity[]>(resolve => resolve([expected]));
    jest.spyOn(userService, 'findAll').mockImplementation(() => result);
    expect(await controller.findAll()).toStrictEqual(Array(expected));
  });
});
