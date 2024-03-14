import { ApiResponseProperty } from '@nestjs/swagger';

import { StudioDonationSettingDto } from './studio-donation-setting.dto';
import { StudioPlaySettingDto } from './studio-play-setting.dto';

export class StudioSettingsDto {
  @ApiResponseProperty({ type: StudioPlaySettingDto })
  play: StudioPlaySettingDto;

  @ApiResponseProperty({ type: StudioDonationSettingDto })
  donation: StudioDonationSettingDto;

  constructor(studioPlaySetting: StudioPlaySettingDto, studioDonationSetting: StudioDonationSettingDto) {
    this.play = studioPlaySetting;
    this.donation = studioDonationSetting;
  }
}
