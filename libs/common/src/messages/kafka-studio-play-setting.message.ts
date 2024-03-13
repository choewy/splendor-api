import { StudioPlaySettingEntity } from '@libs/entity';
import { KafkaMessage } from '@libs/kafka';

export class KafkaStudioPlaySettingMessage extends KafkaMessage<
  Pick<StudioPlaySettingEntity, 'studioId' | 'autoPlay' | 'alertVolume' | 'messageVolume' | 'delay' | 'maxSeconds'>
> {
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
