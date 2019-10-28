import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import AuthController from '../auth.controller';
import AuthService from '../auth.service';
import UserRepository from '../../user/user.repository';
import UserService from '../../user/user.service';
import { jwtServiceMock, repositoryMockFactory } from '../../../e2e/mocks';
import { UserDTO } from '../../user/user.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let expected: any;
  let user: UserDTO;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: getRepositoryToken(UserRepository),
          useFactory: repositoryMockFactory,
        },
      ],
      controllers: [AuthController],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    expected = {
      data: {
        email: 'test@example.com',
        accessToken: 'JWT-TOKEN',
      },
    };

    user = new UserDTO();
    user.id = 'tes-user';
    user.email = 'test@example.com';
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an access token and email on signUp.', async () => {
    jest.spyOn(userService, 'create').mockResolvedValue(user);
    expect(await service.signUp(user)).toStrictEqual(expected);
  });

  it('should return an access token and email on login', async () => {
    jest.spyOn(userService, 'login').mockResolvedValue(user);
    expect(await service.login(user)).toStrictEqual(expected);
  });
});
