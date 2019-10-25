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

@Injectable()
export default class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<UserDTO[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<UserDTO> {
    return this.userRepository.findOne({ id });
  }

  async login(userPayload: NewUserDTO): Promise<UserDTO> {
    const normalizedEmail = normalizeEmail(userPayload.email);
    const user = await this.userRepository.findByEmailOrUsername(
      normalizedEmail,
    );

    if (!user) {
      throw new UnauthorizedException(constants.getErrorMsg('USR_05'));
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
      userPayload.username ? userPayload.username : null,
    );

    if (userFound) {
      throw new ConflictException(constants.getErrorMsg('USR_03'));
    }

    const salt = await bcrypt.genSalt(10);

    const newUser: NewUserDTO = {
      ...userPayload,
      password: await bcrypt.hash(userPayload.password, salt),
    };

    return this.userRepository.save(newUser);
  }
}
