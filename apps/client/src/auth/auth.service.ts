import { NodeEnv, SYSTEM_CONFIG, SystemConfigReturnType } from '@libs/configs';
import { UserRepository } from '@libs/entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreateTokensCommand } from './command';
import { ClientJwtService } from '../jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly clientJwtService: ClientJwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async createTokensWithFindUser(command: CreateTokensCommand) {
    if (this.configService.get<SystemConfigReturnType>(SYSTEM_CONFIG).env === NodeEnv.Production) {
      throw new NotFoundException();
    }

    const user = await this.userRepository.findOne({
      relations: { oauths: true },
      where: { id: command.id, oauths: { platform: command.platform } },
    });

    if (user === null) {
      throw new NotFoundException('not found user');
    }

    if (user.oauths.length === 0) {
      throw new NotFoundException('not exists user oauths');
    }

    let i = 0;

    if (command.platform) {
      i = user.oauths.findIndex((oauth) => oauth.platform === command.platform);

      if (i === -1) {
        throw new NotFoundException('not exists user oauths');
      }
    }

    return this.clientJwtService.createTokens(user.id, user.oauths[i].platform);
  }
}
