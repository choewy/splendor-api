import { JwtGuard, ReqJwtUser } from '@libs/jwt';
import { ApiController } from '@libs/swagger';
import { Body, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { UpdateStudioCommand } from './commands';
import { ForbiddenWordsDto, StudioDonationSettingDto, StudioPlaySettingDto, StudioSettingsDto } from './dtos';
import { StudioStreamSettingsDto } from './dtos/studio-stream-settings.dto';
import { GetForbiddenWordsQuery } from './queries';
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

  @Get('settings')
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 스튜디오 설정 조회' })
  @ApiOkResponse({ type: StudioSettingsDto })
  async getStudioSettings(@ReqJwtUser() userId: number) {
    return this.studioService.getStudioSettings(userId);
  }

  @Get('settings/play')
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 스튜디오 재생 설정 조회' })
  @ApiOkResponse({ type: StudioPlaySettingDto })
  async getStudioPlaySetting(@ReqJwtUser() userId: number) {
    return this.studioService.getStudioPlaySetting(userId);
  }

  @Get('settings/donation')
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 스튜디오 후원 설정 조회' })
  @ApiOkResponse({ type: StudioDonationSettingDto })
  async getStudioDonationSetting(@ReqJwtUser() userId: number) {
    return this.studioService.getStudioDonationSetting(userId);
  }

  @Get('settings/stream')
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 스튜디오 스트리밍 설정 조회' })
  @ApiOkResponse({ type: StudioStreamSettingsDto })
  async getStudioStreamSettings(@ReqJwtUser() userId: number) {
    return this.studioService.getStudioStreamSettings(userId);
  }

  @Get('settings/forbidden-words')
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 스튜디오 금지어 조회' })
  @ApiOkResponse({ type: ForbiddenWordsDto })
  async getForbiddenWords(@ReqJwtUser() userId: number, @Query() query: GetForbiddenWordsQuery) {
    return this.studioService.getForbiddenWords(userId, query);
  }
}
