import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { UserRepository } from '../user.repository';
import { PassportJwtPayload } from '@libs/passport';
import { UserDto } from '../dtos';
import { OAuthPlatform } from '@entities/oauth.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getMyProfile(jwtPayload: PassportJwtPayload) {
    const user = await this.userRepository.findOne({
      relations: { oauths: true },
      where: { id: jwtPayload.userId },
    });

    if (user === null) {
      throw new InternalServerErrorException('something is wrong');
    }

    return new UserDto(user, jwtPayload.platform as OAuthPlatform);
  }
}
