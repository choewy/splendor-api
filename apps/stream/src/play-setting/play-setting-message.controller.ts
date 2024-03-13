import { KafkaStudioPlaySettingMessage, KafkaTopics } from '@libs/common';
import { KafkaMessagePayload, OnKafkaTopic } from '@libs/kafka';
import { Injectable } from '@nestjs/common';

import { PlaySettingService } from './play-setting.service';

@Injectable()
export class PlaySettingMessageController {
  constructor(private readonly playSettingService: PlaySettingService) {}

  @OnKafkaTopic(KafkaTopics.StudioPlaySetting)
  async onChangePlaySetting(payload: KafkaMessagePayload<KafkaStudioPlaySettingMessage>) {
    await this.playSettingService.updateStudioPlaySetting(payload.message.value);
  }
}
