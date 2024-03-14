import { ApiController } from '@libs/docs';
import { JwtGuard, ReqJwtUser, SkipJwtGuard } from '@libs/jwt';
import { Body, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { UpdateStudioCommand } from './commands';
import { StudioDto } from './dtos';
import { GetStudioQuery } from './queries';
import { StudioService } from './studio.service';

@ApiController('studio', '스튜디오')
@UseGuards(JwtGuard)
export class StudioController {
  constructor(private readonly studioService: StudioService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 스튜디오 조회' })
  @ApiOkResponse({ type: StudioDto })
  async getStudio(@ReqJwtUser() userId: number) {
    return this.studioService.getStudio(userId);
  }

  @Get(':userId(\\d+)')
  @SkipJwtGuard()
  @ApiOperation({ summary: '스튜디오 조회' })
  @ApiOkResponse({ type: StudioDto })
  async getOtherStudio(@Param() query: GetStudioQuery) {
    return this.studioService.getStudio(query.userId);
  }

  @Patch()
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 스튜디오 수정' })
  @ApiOkResponse({ type: null })
  async updateStudio(@ReqJwtUser() userId: number, @Body() command: UpdateStudioCommand) {
    return this.studioService.updateStudio(userId, command);
  }
}
