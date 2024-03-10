import { JWT_CLIENT_CONFIG, JwtConfigReturnType } from '@libs/configs';
import { OAuthPlatform } from '@libs/entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { ClientTokensDto } from './dtos';
import { ClientContext } from './implements';

@Injectable()
export class ClientJwtService {
  constructor(private readonly configService: ConfigService, private readonly jwtService: JwtService) {}

  createTokens(id: number, platform: OAuthPlatform) {
    const config = this.configService.get<JwtConfigReturnType>(JWT_CLIENT_CONFIG);
    const payload = new ClientContext(id, platform).toPlainObject();

    return new ClientTokensDto(
      this.jwtService.sign(payload, config.access.signOptions),
      this.jwtService.sign(payload, config.refresh.signOptions),
    );
  }

  async refreshTokens(req: Request, refreshToken: string) {
    const config = this.configService.get<JwtConfigReturnType>(JWT_CLIENT_CONFIG);

    const access = (req.headers.authorization ?? '').replace('Bearer ', '');
    const accessPayload = await this.jwtService
      .verifyAsync(access, { ...config.access.verifyOptions, ignoreExpiration: true })
      .catch((e) => {
        throw new UnauthorizedException(e);
      });

    const refreshPayload = await this.jwtService.verifyAsync(refreshToken, config.refresh.verifyOptions).catch((e) => {
      throw new UnauthorizedException(e);
    });

    if (accessPayload.id === refreshPayload.id && accessPayload.platform === refreshPayload.platform) {
      return this.createTokens(accessPayload.platform, accessPayload.id);
    }

    throw new UnauthorizedException();
  }
}
