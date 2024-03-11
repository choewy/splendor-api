import { FactoryProvider, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtLibsModuleAsyncOptions } from './interfaces';

export const JWT_STRATEGY = '__jwt_strategy__';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY) {
  static createProvider(moduleAsyncOptions: JwtLibsModuleAsyncOptions): FactoryProvider {
    return {
      inject: [...moduleAsyncOptions.inject],
      provide: JwtStrategy,
      async useFactory(...dependencies) {
        const moduleOptions = await moduleAsyncOptions.useFactory(...dependencies);
        return new JwtStrategy(moduleOptions.access.secret);
      },
    };
  }

  constructor(secretOrKey: string | Buffer) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey,
    });
  }

  async validate(payload: JwtPayload): Promise<{ id: number } | null> {
    return payload ? { id: payload.id } : null;
  }
}
