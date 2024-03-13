import { StudioDonationSettingEntity } from '@libs/entity';
import { KafkaMessage } from '@libs/kafka';

export class KafkaStudioDonationSettingMessage extends KafkaMessage {
  constructor(studioDonationSetting: StudioDonationSettingEntity) {
    super({
      studioId: studioDonationSetting.studioId,
      min: studioDonationSetting.min,
      max: studioDonationSetting.max,
      status: studioDonationSetting.status,
    });
  }
}
