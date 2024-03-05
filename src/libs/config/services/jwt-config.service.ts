import { Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';

import { AbstractConfigService } from '../abstracts';

@Injectable()
export class JwtConfigService extends AbstractConfigService {
  private readonly JWT_SECRET = this.configService.get<string>('JWT_SECRET');

  getJwtSignOptions(): JwtSignOptions {
    return {
      secret: this.JWT_SECRET,
      expiresIn: '1h',
    };
  }

  getJwtModuleOptions(): JwtModuleOptions {
    return {
      global: true,
      secret: this.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    };
  }
}
