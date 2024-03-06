import { Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';

import { AbstractConfigService } from '../abstracts';

@Injectable()
export class JwtConfigService extends AbstractConfigService {
  private readonly NODE_ENV = this.configService.get<string>('NODE_ENV');
  private readonly JWT_ACCESS_SECRET = this.configService.get<string>('JWT_ACCESS_SECRET');
  private readonly JWT_REFRESH_SECRET = this.configService.get<string>('JWT_REFRESH_SECRET');

  getNodeEnv() {
    return this.NODE_ENV;
  }

  getJwtAccessSignOptions(): JwtSignOptions {
    return {
      secret: this.JWT_ACCESS_SECRET,
      expiresIn: '1h',
    };
  }

  getJwtRefreshSignOptions(): JwtSignOptions {
    return {
      secret: this.JWT_REFRESH_SECRET,
      expiresIn: '14d',
    };
  }

  getJwtModuleOptions(): JwtModuleOptions {
    return {
      global: true,
      secret: this.JWT_ACCESS_SECRET,
      signOptions: this.getJwtAccessSignOptions(),
    };
  }
}
