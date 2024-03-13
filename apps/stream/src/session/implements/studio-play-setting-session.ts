import { KafkaStudioPlaySettingDto } from '@libs/common';

export class StudioSettingSession {
  autoPlay: boolean;
  alertVolume: number;
  messageVolume: number;
  delay: string;
  maxSeconds: string;

  constructor(studioPlaySetting: KafkaStudioPlaySettingDto) {
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
