import { StudioDonationSettingEntity } from '@libs/entity';
import { KafkaMessage } from '@libs/kafka';

export class KafkaStudioDonationSettingDto implements Pick<StudioDonationSettingEntity, 'studioId' | 'min' | 'max' | 'status'> {
  studioId: number;
  min: number;
  max: number;
  status: boolean;

  constructor(studioDonationSetting: StudioDonationSettingEntity) {
    this.studioId = studioDonationSetting.studioId;
    this.min = studioDonationSetting.min;
    this.max = studioDonationSetting.max;
    this.status = studioDonationSetting.status;
  }
}

export class KafkaStudioDonationSettingMessage extends KafkaMessage<KafkaStudioDonationSettingDto> {
  constructor(studioDonationSetting: StudioDonationSettingEntity) {
    super(new KafkaStudioDonationSettingDto(studioDonationSetting));
  }
}
