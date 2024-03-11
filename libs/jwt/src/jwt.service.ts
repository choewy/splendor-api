import { FactoryProvider, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtModuleOptions, JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import { JwtTokens } from './implements';
import { JwtLibsModuleAsyncOptions, JwtLibsModuleOptions } from './interfaces';

@Injectable()
export class JwtLibsService {
  static createProvider(moduleAsyncOptions: JwtLibsModuleAsyncOptions): FactoryProvider {
    return {
      inject: [JwtService, ...moduleAsyncOptions.inject],
      provide: JwtLibsService,
      async useFactory(jwtService: JwtService, ...dependencies) {
        const moduleOptions = await moduleAsyncOptions.useFactory(...dependencies);

        return new JwtLibsService(jwtService, moduleOptions.access, moduleOptions.refresh);
      },
    };
  }

  static mock(moduleOptions?: Partial<JwtLibsModuleOptions>): FactoryProvider {
    if (moduleOptions == null) {
      moduleOptions = {};
    }

    if (moduleOptions?.access == null) {
      moduleOptions.access = {
        secret: 'mock:access',
        signOptions: { expiresIn: '1h' },
        verifyOptions: {},
      };
    }

    if (moduleOptions?.refresh == null) {
      moduleOptions.refresh = {
        secret: 'mock:refresh',
        signOptions: { expiresIn: '1d' },
        verifyOptions: {},
      };
    }

    return {
      provide: JwtLibsService,
      useFactory() {
        return new JwtLibsService(new JwtService(), moduleOptions?.access, moduleOptions?.refresh);
      },
    };
  }

  constructor(
    private readonly jwtService: JwtService,
    private readonly accessOptions: JwtModuleOptions,
    private readonly refreshOptions: JwtModuleOptions,
  ) {}

  private getAccessSignOptions(): JwtSignOptions {
    return { ...this.accessOptions.signOptions, secret: this.accessOptions.secret };
  }

  private getAccessVerifyOptions(ignoreExpiration?: boolean): JwtVerifyOptions {
    return { ...this.accessOptions.verifyOptions, secret: this.accessOptions.secret, ignoreExpiration };
  }

  private getRefreshSignOptions(): JwtSignOptions {
    return { ...this.refreshOptions.signOptions, secret: this.refreshOptions.secret };
  }

  private getRefreshVerifyOptions(ignoreExpiration?: boolean): JwtVerifyOptions {
    return { ...this.refreshOptions.verifyOptions, secret: this.refreshOptions.secret, ignoreExpiration };
  }

  createTokens(id: number) {
    return new JwtTokens(
      this.jwtService.sign({ id }, this.getAccessSignOptions()),
      this.jwtService.sign({ id }, this.getRefreshSignOptions()),
    );
  }

  refreshTokens(req: Request, refresh: string) {
    const access = (req.headers.authorization ?? '').replace('Bearer ', '');

    let accessPayload: JwtPayload;

    try {
      accessPayload = this.jwtService.verifyAsync(access, this.getAccessVerifyOptions(true));
    } catch (e) {
      throw new UnauthorizedException(e);
    }

    let refreshPayload: JwtPayload;

    try {
      refreshPayload = this.jwtService.verifyAsync(refresh, this.getRefreshVerifyOptions());
    } catch (e) {
      throw new UnauthorizedException(e);
    }

    if (accessPayload.id === refreshPayload.id) {
      return this.createTokens(accessPayload.id);
    }

    throw new UnauthorizedException();
  }
}
