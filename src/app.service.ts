import { AppConfigService } from '@libs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly appConfigService: AppConfigService) {}

  getVersion(): string {
    return this.appConfigService.getVersion();
  }
}
