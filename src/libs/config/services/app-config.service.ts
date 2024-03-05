import { Injectable } from '@nestjs/common';

import { AbstractConfigService } from '../abstracts';

@Injectable()
export class AppConfigService extends AbstractConfigService {
  private readonly APP_VERSION = this.configService.get<string>('APP_VERSION');

  getVersion(): string {
    return this.APP_VERSION;
  }
}
