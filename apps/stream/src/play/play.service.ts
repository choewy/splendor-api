import { EventService } from '@libs/event';
import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

import {
  DonationSessionManager,
  StudioPlaySessionManager,
  StudioSettingSessionManager,
  WidgetSessionManager,
  WidgetSessionStatus,
} from '../session';

@Injectable()
export class PlayService {
  constructor(
    private readonly eventService: EventService,
    private readonly studioPlaySessionManager: StudioPlaySessionManager,
    private readonly studioSettingSessionManager: StudioSettingSessionManager,
    private readonly widgetSessionManager: WidgetSessionManager,
    private readonly donationSessionManager: DonationSessionManager,
  ) {}

  async clear(studioId: number) {
    const studioPlaySession = await this.studioPlaySessionManager.get(studioId);

    if (studioPlaySession === null) {
      throw new WsException('not found studio play session');
    }

    const widgetSessions = await this.widgetSessionManager.getAll(studioId);

    for (const widgetSession of widgetSessions) {
      await this.widgetSessionManager.set(
        studioId,
        widgetSession.id,
        widgetSession.setPointer(-1).setStatus(WidgetSessionStatus.PlayComplete),
      );
    }
  }

  async play(studioId: number, nextPointer: number) {
    const studioPlaySession = await this.studioPlaySessionManager.get(studioId);

    if (studioPlaySession === null) {
      throw new WsException('not found studio play session');
    }

    const widgetSessions = await this.widgetSessionManager.getAll(studioId);

    for (const widgetSession of widgetSessions) {
      await this.widgetSessionManager.set(
        studioId,
        widgetSession.id,
        widgetSession.setPointer(nextPointer).setStatus(WidgetSessionStatus.Playing),
      );
    }
  }
}
