import { StudioDonationSettingEntity } from '@libs/entity';
import { KafkaMessage } from '@libs/kafka';

export class KafkaStudioDonationSettingMessage extends KafkaMessage {
  static readonly KEY = 'studioDonationSetting';

  constructor(studioDonationSetting: StudioDonationSettingEntity) {
    super(KafkaStudioDonationSettingMessage.KEY, {
      studioId: studioDonationSetting.studioId,
      min: studioDonationSetting.min,
      max: studioDonationSetting.max,
      status: studioDonationSetting.status,
    });
  }
}
