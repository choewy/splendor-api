import { StudioPlaySettingEntity } from '@libs/entity';
import { ApiResponseProperty } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

export class StudioSettingSession {
  @ApiResponseProperty({ type: Boolean })
  autoPlay = false;

  @ApiResponseProperty({ type: Number })
  alertVolume = 0;

  @ApiResponseProperty({ type: Number })
  messageVolume = 0;

  @ApiResponseProperty({ type: String, format: 'float' })
  delay = '0.0';

  @ApiResponseProperty({ type: String, format: 'float' })
  maxSeconds = '0.0';

  constructor(studioPlaySetting: Partial<StudioPlaySettingEntity>) {
    if (studioPlaySetting) {
      this.autoPlay = studioPlaySetting.autoPlay;
      this.alertVolume = studioPlaySetting.alertVolume;
      this.messageVolume = studioPlaySetting.messageVolume;
      this.delay = studioPlaySetting.delay;
      this.maxSeconds = studioPlaySetting.maxSeconds;
    }
  }

  stringify() {
    return JSON.stringify(this, null, 2);
  }

  static toInstance(plainText: string) {
    if (plainText === null) {
      return null;
    }

    console.log(plainText);

    try {
      return plainToInstance(this, JSON.parse(plainText), {
        enableCircularCheck: true,
        enableImplicitConversion: true,
      });
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
