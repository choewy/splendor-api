import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenExpiredError } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { ContextService } from 'src/core/context/context.service';
import { MetadataKey, RequestHeader, ResponseHeader } from 'src/persistent/enums';

import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly contextService: ContextService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.contextService.executionContext = context;

    if (!this.reflector.getAllAndOverride(MetadataKey.RequiredJwtAuthGuard, [context.getClass(), context.getHandler()])) {
      return true;
    }

    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    const accessToken = (request.headers[RequestHeader.Authorization] ?? '').replace('Bearer ', '');
    const accessTokenVerifyResult = this.authService.verifyAccessToken(accessToken);

    if (!accessTokenVerifyResult.payload) {
      throw new UnauthorizedException();
    }

    const oauth = await this.authService.getOAuth(accessTokenVerifyResult.payload.id);

    if (!oauth) {
      throw new UnauthorizedException();
    }

    this.contextService.requestUser = oauth;

    if (accessTokenVerifyResult.error instanceof TokenExpiredError) {
      const refreshToken = (request.headers[RequestHeader.XRefreshToken] ?? '').toString();
      const refreshTokenVerifyResult = this.authService.verifyRefreshToken(accessToken, refreshToken);

      if (!refreshTokenVerifyResult) {
        throw new UnauthorizedException();
      }

      const token = await this.authService.reIssueToken(oauth);

      response.setHeader(ResponseHeader.XAccessToken, token.accessToken);
      response.setHeader(ResponseHeader.XRefreshToken, token.refreshToken);
    }

    return true;
  }
}
