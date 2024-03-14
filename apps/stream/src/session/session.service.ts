import { BeforeApplicationShutdown, Injectable } from '@nestjs/common';

import {
  DonationSessionManager,
  SocketSessionManager,
  StudioPlaySessionManager,
  StudioSettingSessionManager,
  WidgetSessionManager,
} from './managers';

@Injectable()
export class SessionService implements BeforeApplicationShutdown {
  constructor(
    private readonly socketSessionManager: SocketSessionManager,
    private readonly studioPlaySessionManager: StudioPlaySessionManager,
    private readonly studioSettingSessionManager: StudioSettingSessionManager,
    private readonly donationSessionManager: DonationSessionManager,
    private readonly widgetSessionManager: WidgetSessionManager,
  ) {}

  async beforeApplicationShutdown() {
    const socketIds = await this.socketSessionManager.getSocketIds();

    for (const socketId of socketIds) {
      const socketSession = await this.socketSessionManager.delete(socketId);

      if (socketSession === null) {
        continue;
      }

      const studioId = socketSession.studioId;
      const widgetSocketIds = await this.widgetSessionManager.getSocketIds(studioId);
      const deleteSocketIds: string[] = [];

      for (const widgetSocketId of widgetSocketIds) {
        if (socketId === widgetSocketId) {
          deleteSocketIds.push(widgetSocketId);
        }
      }

      if (deleteSocketIds.length === 0) {
        continue;
      }

      await this.widgetSessionManager.deleteMany(studioId, ...deleteSocketIds);
      const widgetCount = await this.widgetSessionManager.getCount(studioId);

      if (widgetCount > 0) {
        continue;
      }

      await this.studioPlaySessionManager.delete(studioId);
      await this.studioSettingSessionManager.delete(studioId);
      await this.donationSessionManager.delete(studioId);
    }
  }
}
