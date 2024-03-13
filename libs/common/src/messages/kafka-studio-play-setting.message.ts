import { StudioPlaySettingEntity } from '@libs/entity';
import { KafkaMessage } from '@libs/kafka';

export class KafkaStudioPlaySettingMessage extends KafkaMessage {
  static readonly KEY = 'studioPlaySetting';

  constructor(studioPlaySetting: StudioPlaySettingEntity) {
    super(KafkaStudioPlaySettingMessage.KEY, {
      studioId: studioPlaySetting.studioId,
      autoPlay: studioPlaySetting.autoPlay,
      alertVolume: studioPlaySetting.alertVolume,
      messageVolume: studioPlaySetting.messageVolume,
      delay: studioPlaySetting.delay,
      maxSeconds: studioPlaySetting.maxSeconds,
    });
  }
}
