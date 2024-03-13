import { KafkaStudioPlaySettingDto } from '@libs/common';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { PlaySettingEvent } from './constants';
import { SessionService } from '../session';

@Injectable()
export class PlaySettingService {
  constructor(private readonly eventEmitter: EventEmitter2, private readonly sessionService: SessionService) {}

  async updateStudioPlaySetting(studioPlaySetting: KafkaStudioPlaySettingDto) {
    const playSettingSession = await this.sessionService.updatePlaySettingSession(studioPlaySetting);

    if (playSettingSession) {
      this.eventEmitter.emit(PlaySettingEvent.Change, studioPlaySetting.studioId, playSettingSession);
    }
  }
}
