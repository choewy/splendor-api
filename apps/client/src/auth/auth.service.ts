import { NodeEnv, SYSTEM_CONFIG, SystemConfigReturnType } from '@libs/configs';
import { UserRepository } from '@libs/entity';
import { JwtLibsService } from '@libs/jwt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreateTokensCommand } from './command';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtLibsService: JwtLibsService,
    private readonly userRepository: UserRepository,
  ) {}

  async createTokensWithFindUser(command: CreateTokensCommand) {
    if (this.configService.get<SystemConfigReturnType>(SYSTEM_CONFIG).env === NodeEnv.Production) {
      throw new NotFoundException();
    }

    const user = await this.userRepository.findOne({
      where: { id: command.id },
    });

    if (user === null) {
      throw new NotFoundException('not found user');
    }

    if (user.oauths.length === 0) {
      throw new NotFoundException('not exists user oauths');
    }

    return this.jwtLibsService.createTokens(user.id);
  }
}
