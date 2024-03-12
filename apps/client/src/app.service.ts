import { VersionDto } from '@libs/common';
import { APP_CONFIG, AppConfigReturnType } from '@libs/configs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getVersion() {
    return new VersionDto('client', this.configService.get<AppConfigReturnType>(APP_CONFIG).version);
  }
}
