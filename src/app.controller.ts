import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('앱')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: '서버 애플리케이션 버전 확인' })
  @ApiOkResponse({ type: String })
  getVersion() {
    return this.appService.getVersion();
  }
}
