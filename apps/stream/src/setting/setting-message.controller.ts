import { KafkaStudioPlaySettingMessage, KafkaTopics } from '@libs/common';
import { KafkaMessagePayload, OnKafkaTopic } from '@libs/kafka';
import { Injectable } from '@nestjs/common';

import { SettingService } from './setting.service';

@Injectable()
export class SettingMessageController {
  constructor(private readonly settingService: SettingService) {}

  @OnKafkaTopic(KafkaTopics.StudioPlaySetting)
  async onChangePlaySetting(payload: KafkaMessagePayload<KafkaStudioPlaySettingMessage>) {
    await this.settingService.updateSetting(payload.message.value);
  }
}
