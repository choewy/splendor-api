import { StudioSettingEntity } from '@entities/studio-setting.entity';
import { ApiResponseProperty } from '@nestjs/swagger';

export class StudioSettingDto {
  @ApiResponseProperty({ type: String })
  introduction: string;

  @ApiResponseProperty({ type: Number })
  alertSoundVolume: number;

  @ApiResponseProperty({ type: Number })
  messageSoundVolume: number;

  constructor(studioSetting: StudioSettingEntity) {
    this.introduction = studioSetting.introduction ?? '';
    this.alertSoundVolume = studioSetting.alertSoundVolume;
    this.messageSoundVolume = studioSetting.messageSoundVolume;
  }
}
