import { StudioPlaySettingEntity } from '@libs/entity';
import { KafkaMessage } from '@libs/kafka';

export class KafkaStudioPlaySettingDto
  implements Pick<StudioPlaySettingEntity, 'studioId' | 'autoPlay' | 'alertVolume' | 'messageVolume' | 'delay' | 'maxSeconds'>
{
  studioId: number;
  autoPlay: boolean;
  alertVolume: number;
  messageVolume: number;
  delay: string;
  maxSeconds: string;

  constructor(studioPlaySetting: StudioPlaySettingEntity) {
    this.studioId = studioPlaySetting.studioId;
    this.autoPlay = studioPlaySetting.autoPlay;
    this.alertVolume = studioPlaySetting.alertVolume;
    this.messageVolume = studioPlaySetting.messageVolume;
    this.delay = studioPlaySetting.delay;
    this.maxSeconds = studioPlaySetting.maxSeconds;
  }
}

export class KafkaStudioPlaySettingMessage extends KafkaMessage<KafkaStudioPlaySettingDto> {
  constructor(studioPlaySetting: StudioPlaySettingEntity) {
    super(new KafkaStudioPlaySettingDto(studioPlaySetting));
  }
}
