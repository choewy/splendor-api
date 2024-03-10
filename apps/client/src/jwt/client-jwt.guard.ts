import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import { CLIENT_JWT_STRATEGY } from './client-jwt.strategy';
import { IGNORE_CLIENT_JWT_ERROR } from './decorators';

@Injectable()
export class ClientJwtGuard extends AuthGuard(CLIENT_JWT_STRATEGY) {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  handleRequest<TUser = any>(e: Error, payload: any, info: Error, ctx: ExecutionContext): TUser {
    const isIgnoreError = this.reflector.getAllAndOverride<boolean>(IGNORE_CLIENT_JWT_ERROR, [ctx.getClass(), ctx.getHandler()]);

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
