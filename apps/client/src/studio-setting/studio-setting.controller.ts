import { ApiController } from '@libs/docs';
import { JwtGuard, ReqJwtUser } from '@libs/jwt';
import { Body, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { UpdateStudioDonationSettingCommand, UpdateStudioPlaySettingCommand } from './commands';
import { StudioSettingService } from './studio-setting.service';

@ApiController('studio-settings', '스튜디오 설정')
@UseGuards(JwtGuard)
export class StudioSettingController {
  constructor(private readonly studioSettingService: StudioSettingService) {}

  @Patch('play')
  @ApiBearerAuth()
  @ApiOperation({ summary: '스튜디오 재생 설정 변경' })
  @ApiOkResponse({ type: null })
  async updateStudioPlaySetting(@ReqJwtUser() userId: number, @Body() command: UpdateStudioPlaySettingCommand) {
    return this.studioSettingService.updateStudioPlaySetting(userId, command);
  }

  @Patch('donation')
  @ApiBearerAuth()
  @ApiOperation({ summary: '스튜디오 후원 설정 변경' })
  @ApiOkResponse({ type: null })
  async updateStudioDonationSetting(@ReqJwtUser() userId: number, @Body() command: UpdateStudioDonationSettingCommand) {
    return this.studioSettingService.updateStudioDonationSetting(userId, command);
  }
}
