import { CurrentUserClaim } from '@common/decorators';
import { Injectable } from '@nestjs/common';

import { UserDto } from '../dtos';
import { UserRepository } from '../user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getMyProfile(currentUser: CurrentUserClaim) {
    const user = await this.userRepository.findOne({
      relations: { oauths: true },
      where: { id: currentUser.id },
    });

    return new UserDto(user, currentUser.platform);
  }
}
