import { StudioPlaySettingEntity } from '@libs/entity';
import { ApiResponseProperty } from '@nestjs/swagger';

export class StudioPlaySettingDto {
  @ApiResponseProperty({ type: Number })
  alertVolume: number;

  @ApiResponseProperty({ type: Number })
  messageVolume: number;

  @ApiResponseProperty({ type: String, format: 'float' })
  delay: string;

  @ApiResponseProperty({ type: String, format: 'float' })
  maxSeconds: string;

  @ApiResponseProperty({ type: Boolean })
  autoPlay: boolean;

  constructor(studioPlaySetting: StudioPlaySettingEntity) {
    this.alertVolume = studioPlaySetting.alertVolume;
    this.messageVolume = studioPlaySetting.messageVolume;
    this.delay = studioPlaySetting.delay;
    this.maxSeconds = studioPlaySetting.maxSeconds;
    this.autoPlay = studioPlaySetting.autoPlay;
  }
}
