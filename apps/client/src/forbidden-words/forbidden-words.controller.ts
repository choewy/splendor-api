import { JwtGuard, ReqJwtUser } from '@libs/jwt';
import { ApiController } from '@libs/swagger';
import { Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { ForbiddenWordsDto } from './dtos';
import { ForbiddenWordsService } from './forbidden-words.service';
import { GetForbiddenWordsQuery } from './queries';

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
}
