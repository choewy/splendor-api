import { CurrentUserClaim } from '@common/decorators';
import { NotExistUserOAuthException, NotFoundUserException } from '@common/implements';
import { JwtConfigService } from '@libs/config';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import { AuthUserRepository } from './auth-user.repository';
import { TokensDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(
    private readonly authUserRepository: AuthUserRepository,
    private readonly jwtConfigService: JwtConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private getTokenFromRequestHeaders(req: Request): string {
    return (req.headers.authorization ?? '').replace('Bearer ', '');
  }

  validateAccess(access: string): JwtPayload {
    try {
      return this.jwtService.verify(access, this.jwtConfigService.getJwtAccessSignOptions());
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }

  validateAccessIgnoreExpiration(access: string): JwtPayload {
    try {
      return this.jwtService.verify(access, {
        ...this.jwtConfigService.getJwtAccessSignOptions(),
        ignoreExpiration: true,
      });
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }

  validateRefresh(refresh: string): JwtPayload {
    try {
      return this.jwtService.verify(refresh, this.jwtConfigService.getJwtRefreshSignOptions());
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }

  async createTokens(id: number) {
    if (this.jwtConfigService.getNodeEnv() !== 'local') {
      throw new NotFoundException();
    }

    const user = await this.authUserRepository.findById(id);

    if (user === null) {
      throw new NotFoundUserException();
    }

    const oauth = user.oauths[0] ?? null;

    if (oauth === null) {
      throw new NotExistUserOAuthException();
    }

    const claim = CurrentUserClaim.to(id, oauth.platform);

    return new TokensDto(
      this.jwtService.sign(claim, this.jwtConfigService.getJwtAccessSignOptions()),
      this.jwtService.sign(claim, this.jwtConfigService.getJwtRefreshSignOptions()),
    );
  }

  async refreshTokens(req: Request, access: string, refresh: string) {
    const headerClaim = CurrentUserClaim.from(this.validateAccessIgnoreExpiration(this.getTokenFromRequestHeaders(req)));
    const accessClaim = CurrentUserClaim.from(this.validateAccessIgnoreExpiration(access));
    const refreshClaim = CurrentUserClaim.from(this.validateRefresh(refresh));

    if (headerClaim?.id !== accessClaim?.id || accessClaim?.id !== refreshClaim?.id) {
      throw new UnauthorizedException();
    }

    const claim = headerClaim.toPlainObject();

    return new TokensDto(
      this.jwtService.sign(claim, this.jwtConfigService.getJwtAccessSignOptions()),
      this.jwtService.sign(claim, this.jwtConfigService.getJwtRefreshSignOptions()),
    );
  }
}
