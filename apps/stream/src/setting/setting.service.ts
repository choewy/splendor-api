import { KafkaStudioPlaySettingDto } from '@libs/common';
import { EventService } from '@libs/event';
import { Injectable } from '@nestjs/common';

import { SettingChangedEvent } from './events';
import { StudioSettingSession, StudioSettingSessionManager } from '../session';

@Injectable()
export class SettingService {
  constructor(private readonly eventService: EventService, private readonly studioSettingSessionManager: StudioSettingSessionManager) {}

  async updateSetting(studioPlaySetting: KafkaStudioPlaySettingDto) {
    const studioId = studioPlaySetting.studioId;
    const session = await this.studioSettingSessionManager.set(studioId, new StudioSettingSession(studioPlaySetting));

    this.eventService.send(new SettingChangedEvent(studioId, session));
  }
}
