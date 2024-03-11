import { JwtGuard, ReqJwtUser } from '@libs/jwt';
import { ApiController } from '@libs/swagger';
import { Body, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { UpdateStudioCommand } from './commands';
import { StudioService } from './studio.service';

@ApiController('studio', '스튜디오')
@UseGuards(JwtGuard)
export class StudioController {
  constructor(private readonly studioService: StudioService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 스튜디오 조회' })
  @ApiOkResponse()
  async getStudio(@ReqJwtUser() userId: number) {
    return this.studioService.getStudio(userId);
  }

  @Patch()
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 스튜디오 수정' })
  @ApiOkResponse({ type: null })
  async updateStudio(@ReqJwtUser() userId: number, @Body() command: UpdateStudioCommand) {
    return this.studioService.updateStudio(userId, command);
  }
}
