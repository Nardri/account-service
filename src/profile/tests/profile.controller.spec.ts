import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
// import { createRequest } from 'node-mocks-http';

import ProfileController from '../profile.controller';
import ProfileRepository from '../profile.repository';
import { repositoryMockFactory } from '../../../e2e/mocksAndUtils';
import ProfileService from '../profile.service';
// import { ProfileDTO, ProfileResponse } from '../profile.dto';
// import ProfileEntity from '../profile.entity';

describe('Profile Controller', () => {
  let controller: ProfileController;
  // let profileService: ProfileService;

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
    // profileService = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // it('should return user profile', async () => {
  //   const expected = new ProfileEntity();
  //   expected.firstName = 'test';
  //   const req = createRequest();
  //   req['user'] = {
  //     id: '-rirhdidio',
  //   };
  //
  //   const result = new Promise<ProfileResponse>(resolve => resolve(expected));
  //   jest.spyOn(profileService, 'getProfile').mockImplementation(() => result);
  //   expect(await controller.profile(req)).toStrictEqual(expected);
  // });
});
