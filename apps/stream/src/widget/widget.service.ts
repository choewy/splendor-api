import { AlertWidgetEntity, AlertWidgetRepository, StudioPlaySettingRepository } from '@libs/entity';
import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { WidgetSocketAuth } from './interfaces';
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
    private readonly studioPlaySettingRepository: StudioPlaySettingRepository,
    private readonly studioPlaySessionManager: StudioPlaySessionManager,
    private readonly studioSettingSessionManager: StudioSettingSessionManager,
    private readonly donationSessionManager: DonationSessionManager,
    private readonly widgetSessionManager: WidgetSessionManager,
  ) {}

  protected getSocketAuth(client: Socket): WidgetSocketAuth {
    const auth = client.handshake.auth;

    const id = auth.id ?? null;
    const type = auth.type ?? null;

    if (id === null || type === null) {
      throw new WsException('invalid socket auth');
    }

    return { id, type };
  }

  protected async getWidget(id: string, type: WidgetType) {
    let widget: AlertWidgetEntity;

    switch (type) {
      case WidgetType.Alert:
        widget = await this.alertWidgetRepository.findOne({
          relations: { studio: true },
          select: { id: true, studio: { id: true } },
          where: { id },
        });
        break;

      default:
        widget = null;
    }

    if (widget === null) {
      throw new WsException('not found widget');
    }

    return widget;
  }

  async createSession(client: Socket) {
    const auth = this.getSocketAuth(client);
    const widget = await this.getWidget(auth.id, auth.type);

    const studioId = widget.studio.id;
    await this.socketSessionManager.create(client.id, studioId);
    const studioPlaySession = await this.studioPlaySessionManager.get(studioId);

    if (studioPlaySession === null) {
      await this.studioPlaySessionManager.create(studioId);
    }

    const session = new WidgetSession(widget.id, studioId, auth.type);
    await this.widgetSessionManager.set(studioId, client.id, session);

    return session;
  }

  async deleteSession(client: Socket) {
    const socketSession = await this.socketSessionManager.delete(client.id);

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

  async getSetting(client: Socket) {
    const socketSession = await this.socketSessionManager.get(client.id);
    const studioId = socketSession.studioId;

    if (socketSession === null) {
      throw new WsException(`not exists client(${client.id}) session`);
    }

    let settingSession = await this.studioSettingSessionManager.get(studioId);

    if (settingSession === null) {
      const studioPlaySetting = await this.studioPlaySettingRepository.findOneBy({ studioId: studioId });

      if (studioPlaySetting === null) {
        throw new WsException('not found studio setting');
      }

      settingSession = await this.studioSettingSessionManager.create(studioId, studioPlaySetting);
    }

    return settingSession;
  }
}
