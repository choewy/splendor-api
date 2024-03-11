import { JwtGuard, ReqJwtUser, SkipJwtGuard } from '@libs/jwt';
import { ApiController } from '@libs/swagger';
import { Body, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { UpdateStudioCommand } from './commands';
import { ForbiddenWordsDto, StudioDto } from './dtos';
import { GetForbiddenWordsQuery, GetStudioQuery } from './queries';
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

  @Get('forbidden-words')
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 스튜디오 금지어 조회' })
  @ApiOkResponse({ type: ForbiddenWordsDto })
  async getForbiddenWords(@ReqJwtUser() userId: number, @Query() query: GetForbiddenWordsQuery) {
    return this.studioService.getForbiddenWords(userId, query);
  }
}
