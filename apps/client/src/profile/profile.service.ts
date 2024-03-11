import { UserRepository } from '@libs/entity';
import { Injectable, NotFoundException } from '@nestjs/common';

import { UpdateProfileCommand } from './commands';
import { ProfileDto } from './dtos';

@Injectable()
export class ProfileService {
  constructor(private readonly userRepository: UserRepository) {}

  async getProfile(id: number) {
    const user = await this.userRepository.findOne({
      relations: { count: true, oauths: true },
      where: { id },
    });

    if (user === null) {
      throw new NotFoundException('not found user');
    }

    return new ProfileDto(user);
  }

  async updateProfile(id: number, command: UpdateProfileCommand) {
    const user = await this.userRepository.findOne({
      relations: { oauths: true },
      where: { id },
    });

    if (user === null) {
      throw new NotFoundException('not found user');
    }

    await this.userRepository.update(id, { nickname: command.nickname });

    const updatedUser = this.userRepository.create({
      ...user,
      nickname: command.nickname,
    });

    return new ProfileDto(updatedUser);
  }
}
