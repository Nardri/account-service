import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import UserController from '../user.controller';
import UserService from '../user.service';
import UserEntity from '../user.entity';
import UserRepository from '../user.repository';
import { UserDTO } from '../user.dto';
import { MockType, repositoryMockFactory } from '../../../e2e/mocks';

describe('User Controller without DB Access.', () => {
  let controller: UserController;
  let userService: UserService;
  let repositoryMock: MockType<Repository<UserEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserRepository),
          useFactory: repositoryMockFactory,
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
    const expected = new UserDTO();
    expected.username = 'tes-user';
    expected.email = 'test@example.com';

    const result = new Promise<UserDTO[]>(resolve => resolve([expected]));
    jest.spyOn(userService, 'findAll').mockImplementation(() => result);
    expect(await controller.findAll()).toStrictEqual(Array(expected));
  });
});
