import { StudioPlaySettingEntity } from '@libs/entity';
import { KafkaMessage } from '@libs/kafka';

export class KafkaStudioPlaySettingMessage extends KafkaMessage {
  constructor(studioPlaySetting: StudioPlaySettingEntity) {
    super({
      studioId: studioPlaySetting.studioId,
      autoPlay: studioPlaySetting.autoPlay,
      alertVolume: studioPlaySetting.alertVolume,
      messageVolume: studioPlaySetting.messageVolume,
      delay: studioPlaySetting.delay,
      maxSeconds: studioPlaySetting.maxSeconds,
    });
  }
}
