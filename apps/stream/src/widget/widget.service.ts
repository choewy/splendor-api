import { AlertWidgetEntity, AlertWidgetRepository } from '@libs/entity';
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

import {
  DonationSessionManager,
  SocketSessionManager,
  StudioPlaySessionManager,
  StudioSettingSessionManager,
  WidgetSession,
  WidgetSessionManager,
  WidgetType,
} from '../session';

@Injectable()
export class WidgetService {
  constructor(
    private readonly socketSessionManager: SocketSessionManager,
    private readonly alertWidgetRepository: AlertWidgetRepository,
    private readonly studioPlaySessionManager: StudioPlaySessionManager,
    private readonly studioSettingSessionManager: StudioSettingSessionManager,
    private readonly donationSessionManager: DonationSessionManager,
    private readonly widgetSessionManager: WidgetSessionManager,
  ) {}

  createStudioRoom(studioId: number) {
    return `widgets_in_${studioId}`;
  }

  async handleConnection(client: Socket) {
    const auth = client.handshake.auth;

    const id = auth.id ?? null;
    const type = auth.type ?? null;

    if (id === null || type === null) {
      return client.disconnect(true);
    }

    let widget: AlertWidgetEntity;

    switch (type) {
      case WidgetType.Alert:
        widget = await this.alertWidgetRepository.findOne({
          relations: { studio: true },
          where: { id },
        });
        break;

      default:
        widget = null;
    }

    if (widget === null) {
      return client.disconnect(true);
    }

    const studioId = widget.studio.id;
    const studioPlaySession = await this.studioPlaySessionManager.get(studioId);

    if (studioPlaySession === null) {
      await this.studioPlaySessionManager.create(studioId);
    }

    await this.widgetSessionManager.set(studioId, client.id, new WidgetSession(type));
    await client.join(this.createStudioRoom(studioId));
  }

  async handleDisconnection(client: Socket) {
    const socketSession = await this.socketSessionManager.get(client.id);

    if (socketSession === null) {
      return;
    }

    const studioId = socketSession.studioId;
    await this.widgetSessionManager.delete(studioId, client.id);
    const widgetCount = await this.widgetSessionManager.getCount(studioId);

    if (widgetCount > 0) {
      return;
    }

    await this.studioPlaySessionManager.delete(studioId);
    await this.studioSettingSessionManager.delete(studioId);
    await this.donationSessionManager.delete(studioId);
  }
}
