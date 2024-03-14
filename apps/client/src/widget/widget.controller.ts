import { ApiController } from '@libs/docs';
import { JwtGuard, ReqJwtUser } from '@libs/jwt';
import { Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { WidgetsDto } from './dtos';
import { WidgetService } from './widget.service';

@ApiController('widgets', '위젯')
export class WidgetController {
  constructor(private readonly widgetService: WidgetService) {}

  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 스튜디오 위젯 조회' })
  @ApiOkResponse({ type: WidgetsDto })
  async getWidgets(@ReqJwtUser() userId: number) {
    return this.widgetService.getWidgets(userId);
  }
}
