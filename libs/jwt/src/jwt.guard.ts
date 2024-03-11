import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import { IGNORE_JWT_ERROR } from './decorators';
import { JWT_STRATEGY } from './jwt.strategy';

@Injectable()
export class JwtGuard extends AuthGuard(JWT_STRATEGY) {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  handleRequest<TUser = any>(e: Error, payload: any, info: Error, ctx: ExecutionContext): TUser {
    const isIgnoreError = this.reflector.getAllAndOverride<boolean>(IGNORE_JWT_ERROR, [ctx.getClass(), ctx.getHandler()]);

    let error = e ?? info;

    if (error) {
      if (isIgnoreError === true) {
        return payload ?? null;
      }

      if (error?.name !== TokenExpiredError.name) {
        error = new JsonWebTokenError(error.message);
      }

      throw new UnauthorizedException(error);
    }

    if (payload == null) {
      if (isIgnoreError === true) {
        return payload ?? null;
      }

      throw new UnauthorizedException();
    }

    return payload ?? null;
  }
}
