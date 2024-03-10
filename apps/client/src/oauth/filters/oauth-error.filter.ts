import { ArgumentsHost, Catch, UnauthorizedException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { NextFunction } from 'express';

import { OAuthGetProfileError, OAuthGetTokenError } from '../implements';

@Catch(OAuthGetTokenError, OAuthGetProfileError)
export class OAuthErrorFilter extends BaseExceptionFilter {
  catch(e: OAuthGetTokenError | OAuthGetProfileError, host: ArgumentsHost): void {
    const exception = new UnauthorizedException();

    exception.cause = { name: e.name, message: e.message, cause: e.cause };

    host.switchToHttp().getNext<NextFunction>()(exception);
  }
}
