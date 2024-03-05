import { PassportJwtGuard, PassportJwtPayload, ReqJwtPayload } from '@libs/passport';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { StudioDto } from './dtos';
import { StudioService } from './services';

@ApiTags('스튜디오')
@Controller('studio')
@UseGuards(PassportJwtGuard)
export class StudioController {
  constructor(private readonly studioService: StudioService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 스튜디오 조회' })
  @ApiOkResponse({ type: StudioDto })
  async getMyStudio(@ReqJwtPayload() jwtPayload: PassportJwtPayload) {
    return this.studioService.getMyStudio(jwtPayload.userId);
  }
}
