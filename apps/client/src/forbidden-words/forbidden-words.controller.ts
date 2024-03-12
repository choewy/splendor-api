import { JwtGuard, ReqJwtUser } from '@libs/jwt';
import { ApiController } from '@libs/swagger';
import { Body, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { SetForbiddenWordCommand } from './commands';
import { ForbiddenWordDto, ForbiddenWordsDto } from './dtos';
import { ForbiddenWordsService } from './forbidden-words.service';
import { GetForbiddenWordQuery, GetForbiddenWordsQuery } from './queries';

@ApiController('forbidden-words', '금지어')
@UseGuards(JwtGuard)
export class ForbiddenWordsController {
  constructor(private readonly forbiddenWordsService: ForbiddenWordsService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 스튜디오 금지어 조회' })
  @ApiOkResponse({ type: ForbiddenWordsDto })
  async getForbiddenWords(@ReqJwtUser() userId: number, @Query() query: GetForbiddenWordsQuery) {
    return this.forbiddenWordsService.getForbiddenWords(userId, query);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 스튜디오 금지어 등록' })
  @ApiCreatedResponse({ type: ForbiddenWordDto })
  async createForbiddenWord(@ReqJwtUser() userId: number, @Body() command: SetForbiddenWordCommand) {
    return this.forbiddenWordsService.createForbiddenWord(userId, command);
  }

  @Patch(':id(\\d+)')
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 스튜디오 금지어 수정' })
  @ApiOkResponse({ type: null })
  async updateForbiddenWord(@ReqJwtUser() userId: number, @Param() param: GetForbiddenWordQuery, @Body() command: SetForbiddenWordCommand) {
    return this.forbiddenWordsService.updateForbiddenWord(userId, param.id, command);
  }

  @Delete(':id(\\d+)')
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 스튜디오 금지어 삭제' })
  @ApiOkResponse({ type: null })
  async deleteForbiddenWord(@ReqJwtUser() userId: number, @Param() param: GetForbiddenWordQuery) {
    return this.forbiddenWordsService.deleteForbiddenWord(userId, param.id);
  }
}
