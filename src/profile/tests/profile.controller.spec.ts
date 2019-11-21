import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createRequest } from 'node-mocks-http';

import ProfileController from '../profile.controller';
import ProfileRepository from '../profile.repository';
import { repositoryMockFactory } from '../../../e2e/mocks';
import ProfileService from '../profile.service';
import { ProfileDTO } from '../profile.dto';

describe('Profile Controller', () => {
  let controller: ProfileController;
  let profileService: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        ProfileService,
        {
          provide: getRepositoryToken(ProfileRepository),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    profileService = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return user profile', async () => {
    const expected = new ProfileDTO();
    expected.firstName = 'test';
    const req = createRequest();
    req['user'] = {
      id: '-rirhdidio',
    };

    const result = new Promise<ProfileDTO>(resolve => resolve(expected));
    jest.spyOn(profileService, 'getProfile').mockImplementation(() => result);
    expect(await controller.profile(req)).toStrictEqual(expected);
  });
});
