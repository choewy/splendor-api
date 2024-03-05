import { PassportJwtGuard, PassportJwtPayload, ReqJwtPayload } from '@libs/passport';
import { Controller, Head, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { StudioService } from './services';

@ApiTags('스튜디오')
@Controller('studio')
@UseGuards(PassportJwtGuard)
export class StudioController {
  constructor(private readonly studioService: StudioService) {}

  @Head()
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 스튜디오 초기화', description: '스튜디오가 없는 경우 생성' })
  async initializeMyStudio(@ReqJwtPayload() jwtPayload: PassportJwtPayload) {
    return this.studioService.initializeMyStudio(jwtPayload.userId);
  }
}
