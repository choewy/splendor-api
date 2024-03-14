import { KafkaStudioPlaySettingDto } from '@libs/common';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { SettingEvent } from './constants';
import { StudioSettingSession, StudioSettingSessionManager } from '../session';

@Injectable()
export class SettingService {
  constructor(private readonly eventEmitter: EventEmitter2, private readonly studioSettingSessionManager: StudioSettingSessionManager) {}

  async updateSetting(studioPlaySetting: KafkaStudioPlaySettingDto) {
    const studioId = studioPlaySetting.studioId;
    const session = await this.studioSettingSessionManager.set(studioId, new StudioSettingSession(studioPlaySetting));
    this.eventEmitter.emit(SettingEvent.Change, studioPlaySetting.studioId, session);
  }
}
