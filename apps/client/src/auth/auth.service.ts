import { JWT_CLIENT_CONFIG, JwtConfigReturnType, NodeEnv, SYSTEM_CONFIG, SystemConfigReturnType } from '@libs/configs';
import { OAuthPlatform, UserRepository } from '@libs/entity';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { CreateTokensCommand, RefreshTokensCommand } from './command';
import { ClientTokensDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async createTokensExistsUser(command: CreateTokensCommand) {
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

    return this.createTokens(user.oauths[0].platform, user.id);
  }

  createTokens(platform: OAuthPlatform, id: number) {
    const config = this.configService.get<JwtConfigReturnType>(JWT_CLIENT_CONFIG);

    const payload = { platform, id };

    return new ClientTokensDto(
      this.jwtService.sign(payload, { ...config.access.signOptions, secret: config.access.secret }),
      this.jwtService.sign(payload, { ...config.refresh.signOptions, secret: config.refresh.secret }),
    );
  }

  async refreshTokens(req: Request, command: RefreshTokensCommand) {
    const config = this.configService.get<JwtConfigReturnType>(JWT_CLIENT_CONFIG);

    const access = (req.headers.authorization ?? '').replace('Bearer ', '');
    const accessPayload = await this.jwtService
      .verifyAsync(access, { ...config.access.verifyOptions, secret: config.access.secret, ignoreExpiration: true })
      .catch((e) => {
        throw new UnauthorizedException(e);
      });

    const refreshPayload = await this.jwtService
      .verifyAsync(command.refresh, { ...config.refresh.verifyOptions, secret: config.refresh.secret })
      .catch((e) => {
        throw new UnauthorizedException(e);
      });

    if (accessPayload.id === refreshPayload.id && accessPayload.platform === refreshPayload.platform) {
      return this.createTokens(accessPayload.platform, accessPayload.id);
    }

    throw new UnauthorizedException();
  }
}
