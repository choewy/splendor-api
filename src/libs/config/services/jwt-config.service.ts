import { JwtModuleOptions } from '@nestjs/jwt';

import { AbstractConfigService } from '../abstracts';

export class JwtConfigService extends AbstractConfigService {
  private readonly JWT_SECRET = this.configService.get<string>('JWT_SECRET');

  getJwtModuleOptions(): JwtModuleOptions {
    return {
      secret: this.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    };
  }
}
