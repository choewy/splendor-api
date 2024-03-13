import { StudioDonationSettingEntity } from '@libs/entity';
import { KafkaMessage } from '@libs/kafka';

export class KafkaStudioDonationSettingMessage extends KafkaMessage<
  Pick<StudioDonationSettingEntity, 'studioId' | 'min' | 'max' | 'status'>
> {
  constructor(studioDonationSetting: StudioDonationSettingEntity) {
    super({
      studioId: studioDonationSetting.studioId,
      min: studioDonationSetting.min,
      max: studioDonationSetting.max,
      status: studioDonationSetting.status,
    });
  }
}
