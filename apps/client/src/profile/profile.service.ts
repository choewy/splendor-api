import { UserRepository } from '@libs/entity';
import { Injectable, NotFoundException } from '@nestjs/common';

import { ProfileDto } from './dtos';

@Injectable()
export class ProfileService {
  constructor(private readonly userRepository: UserRepository) {}

  async getProfile(id: number) {
    const user = await this.userRepository.findOne({
      relations: { oauths: true },
      where: { id },
    });

    if (user === null) {
      throw new NotFoundException('not found user');
    }

    return new ProfileDto(user);
  }
}
