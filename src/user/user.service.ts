import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { NewUserDTO, UserDTO } from './user.dto';
import UserRepository from './user.repository';
import normalizeEmail from '../shared/normalizeEmail';
import constants from '../config/config.constants';
import { IOAuthProfile } from './user.interface';
import ProfileRepository from '../profile/profile.repository';
import ProfileEntity from '../profile/profile.entity';

@Injectable()
export default class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly profileRepository: ProfileRepository,
  ) {}

  async findAll(): Promise<UserDTO[]> {
    return this.userRepository.find();
  }

  async login(userPayload: NewUserDTO): Promise<UserDTO> {
    const normalizedEmail = normalizeEmail(userPayload.email);
    const user = await this.userRepository.findByEmailOrUsername(
      normalizedEmail,
    );

    if (!user) {
      throw new UnauthorizedException(constants.getErrorMsg('USR_05'));
    }

    if (!user.password) {
      throw new BadRequestException(constants.getErrorMsg('USR_01'));
    }

    const match = await bcrypt.compare(userPayload.password, user.password);

    if (!match) {
      throw new BadRequestException(constants.getErrorMsg('USR_01'));
    }

    if (!user.isActive) {
      throw new BadRequestException(constants.getErrorMsg('USR_06'));
    }

    return user;
  }

  async create(userPayload: NewUserDTO): Promise<UserDTO> {
    const normalizedEmail = normalizeEmail(userPayload.email);

    const userFound = await this.userRepository.countUserOccurrence(
      normalizedEmail,
    );

    if (userFound) {
      throw new ConflictException(constants.getErrorMsg('USR_03'));
    }

    const salt = await bcrypt.genSalt(10);
    const newUser: NewUserDTO = {
      ...userPayload,
      password: await bcrypt.hash(userPayload.password, salt),
    };

    const newProfile = new ProfileEntity();
    newUser.profile = await this.profileRepository.save(newProfile);
    return this.userRepository.save(newUser);
  }

  async handleOauthData(data: IOAuthProfile): Promise<UserDTO> {
    const user = await this.userRepository.findByEmailOrUsername(data.email);
    const newUser: NewUserDTO = {
      email: data.email,
      verified: data.verified,
    };

    if (!user) {
      const newProfile = new ProfileEntity();
      newProfile.firstName = data.firstName;
      newProfile.lastName = data.lastName;
      newProfile.photoUrl = data.picture;
      newProfile.username = data.name;
      newUser.profile = await this.profileRepository.save(newProfile);
      return this.userRepository.save(newUser);
    }

    return user;
  }
}
