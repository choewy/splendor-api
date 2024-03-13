import { StudioPlaySettingEntity } from '@libs/entity';
import { ApiResponseProperty } from '@nestjs/swagger';

export class PlaySettingSession {
  @ApiResponseProperty({ type: Boolean })
  autoPlay: boolean;

  @ApiResponseProperty({ type: Number })
  alertVolume: number;

  @ApiResponseProperty({ type: Number })
  messageVolume: number;

  @ApiResponseProperty({ type: String, format: 'float' })
  delay: string;

  @ApiResponseProperty({ type: String, format: 'float' })
  maxSeconds: string;

  constructor(studioPlaySetting: Partial<StudioPlaySettingEntity>) {
    this.autoPlay = studioPlaySetting.autoPlay;
    this.alertVolume = studioPlaySetting.alertVolume;
    this.messageVolume = studioPlaySetting.messageVolume;
    this.delay = studioPlaySetting.delay;
    this.maxSeconds = studioPlaySetting.maxSeconds;
  }

  static createKey(studioId: number) {
    return ['studio', studioId, 'setting'].join(':');
  }
}
