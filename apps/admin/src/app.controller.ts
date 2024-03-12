import { VersionDto } from '@libs/common';
import { ApiController } from '@libs/swagger';
import { Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { AppService } from './app.service';

@ApiController('', 'App')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponse({ type: VersionDto })
  getVersion() {
    return this.appService.getVersion();
  }
}
