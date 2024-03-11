import { ApiResponseProperty } from '@nestjs/swagger';

import { StudioDonationSettingDto } from './studio-donation-setting.dto';
import { StudioPlaySettingDto } from './studio-play-setting.dto';
import { StudioStreamSettingsDto } from './studio-stream-settings.dto';

export class StudioSettingsDto {
  @ApiResponseProperty({ type: StudioPlaySettingDto })
  play: StudioPlaySettingDto;

  @ApiResponseProperty({ type: StudioDonationSettingDto })
  donation: StudioDonationSettingDto;

  @ApiResponseProperty({ type: StudioStreamSettingsDto })
  streams: StudioStreamSettingsDto;

  constructor(
    studioPlaySetting: StudioPlaySettingDto,
    studioDonationSetting: StudioDonationSettingDto,
    studioStreamSettings: StudioStreamSettingsDto,
  ) {
    this.play = studioPlaySetting;
    this.donation = studioDonationSetting;
    this.streams = studioStreamSettings;
  }
}
