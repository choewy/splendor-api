import { JWT_CLIENT_CONFIG, JwtConfigReturnType } from '@libs/configs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ClientContext } from './implements';

export const CLIENT_JWT_STRATEGY = '__client_jwt_strategy__';

@Injectable()
export class ClientJwtStrategy extends PassportStrategy(Strategy, CLIENT_JWT_STRATEGY) {
  constructor(configService: ConfigService) {
    const config = configService.get<JwtConfigReturnType>(JWT_CLIENT_CONFIG);

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.moduleOptions.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<ClientContext> {
    return new ClientContext(payload.id, payload.platform);
  }
}
