import { StudioEntity } from '@libs/entity';
import { ApiResponseProperty } from '@nestjs/swagger';

import { StudioDonationSettingDto } from './studio-donation-setting.dto';
import { StudioPlaySettingDto } from './studio-play-setting.dto';
import { StudioSettingsDto } from './studio-settings.dto';

export class StudioDto {
  @ApiResponseProperty({ type: Number })
  id: number;

  @ApiResponseProperty({ type: String })
  alias: string;

  @ApiResponseProperty({ type: String })
  introduction: string;

  @ApiResponseProperty({ type: StudioSettingsDto })
  settings: StudioSettingsDto;

  constructor(studio: StudioEntity) {
    this.id = studio.id;
    this.alias = studio.alias;
    this.introduction = studio.introduction;
    this.settings = new StudioSettingsDto(
      new StudioPlaySettingDto(studio.studioPlaySetting),
      new StudioDonationSettingDto(studio.studioDonationSetting),
    );
  }
}
