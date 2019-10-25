import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import UserEntity from '../user.entity';
import UserRepository from '../user.repository';
import UserService from '../user.service';
import { NewUserDTO } from '../user.dto';
import { repositoryMockFactory } from '../../../test/testUtils';

describe('UserService', () => {
  let service: UserService;
  let userRepo: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserService,
        {
          provide: getRepositoryToken(UserRepository),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepo = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of users', async () => {
    expect(await service.findAll()).toStrictEqual([]);
  });

  it('should return a user', async () => {
    expect(await service.findOne('-lidjndijw')).toStrictEqual(new UserEntity());
  });

  it('should return create a user', async done => {
    const user = new NewUserDTO();
    user.email = 'example@test.com';
    user.username = 'exampleUser';
    user.password = 'example';

    jest.spyOn(userRepo, 'countUserOccurrence').mockResolvedValue(0);

    await service.create(user).then(res => {
      expect(res).toBeInstanceOf(Object);
      expect(res).toHaveProperty('email');
      expect(res).toHaveProperty('password');
      expect(res).toHaveProperty('username');
      expect(res.email).toBe(user.email);
      expect(res.username).toBe(user.username);
      done();
    });
  });

  it('should return create an error if the user already exists', async done => {
    const user = new NewUserDTO();
    user.email = 'example@test.com';
    user.username = 'exampleUser';
    user.password = 'example';

    jest.spyOn(userRepo, 'countUserOccurrence').mockResolvedValue(1);
    await service
      .create(user)
      .then()
      .catch(err => {
        expect(err).toBeInstanceOf(Error);
        expect(err.status).toBe(409);
        expect(err.message.message).toBe('The Email/Username already exists');
        done();
      });
  });
});
