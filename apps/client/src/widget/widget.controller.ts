import { XRefererGuard } from '@libs/common';
import { ApiController } from '@libs/docs';
import { JwtGuard, ReqJwtUser } from '@libs/jwt';
import { Body, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { AlertWidgetDto, WidgetsDto } from './dtos';
import { GetWidgetQuery } from './queries';
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

  @Post('alert')
  @HttpCode(HttpStatus.OK)
  @UseGuards(XRefererGuard)
  @ApiHeader({ name: 'x-referer' })
  @ApiOperation({ summary: '알림 위젯 조회' })
  @ApiOkResponse({ type: AlertWidgetDto })
  async getAlertWidget(@Body() query: GetWidgetQuery) {
    return this.widgetService.getAlertWidget(query.id);
  }
}
