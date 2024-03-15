import { AlertWidgetEntity, AlertWidgetRepository, StudioPlaySettingRepository } from '@libs/entity';
import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { WidgetPlayCompleteCommand } from './commands';
import { WidgetSubChannel } from './constants';
import { WidgetSocketAuth } from './interfaces';
import {
  DonationSessionManager,
  DonationSessionStatus,
  SocketSession,
  SocketSessionManager,
  StudioPlaySessionManager,
  StudioPlayStatus,
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
    private readonly playSessionManager: StudioPlaySessionManager,
    private readonly settingSessionManager: StudioSettingSessionManager,
    private readonly donationSessionManager: DonationSessionManager,
    private readonly widgetSessionManager: WidgetSessionManager,
  ) {}

  roomName(studioId: number) {
    return ['studio', studioId].join('_');
  }

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

  async getSocketSession(socketId: string) {
    const session = await this.socketSessionManager.get(socketId);

    if (session === null) {
      throw new WsException('not found socket session');
    }

    return session;
  }

  protected async getWidgetSession(studioId: number, socketId: string) {
    const session = await this.widgetSessionManager.get(studioId, socketId);

    if (session) {
      throw new WsException('not found widget session');
    }

    return session;
  }

  protected async getPlaySession(studioId: number) {
    let studioPlaySession = await this.playSessionManager.get(studioId);

    if (studioPlaySession === null) {
      studioPlaySession = await this.playSessionManager.create(studioId);
    }

    return studioPlaySession;
  }

  protected async getSettingSession(studioId: number) {
    let settingSession = await this.settingSessionManager.get(studioId);

    if (settingSession === null) {
      const studioPlaySetting = await this.studioPlaySettingRepository.findOneBy({ studioId: studioId });

      if (studioPlaySetting === null) {
        throw new WsException('not found studio setting');
      }

      settingSession = await this.settingSessionManager.create(studioId, studioPlaySetting);
    }

    return settingSession;
  }

  async createSession(client: Socket) {
    const auth = this.getSocketAuth(client);
    const widget = await this.getWidget(auth.id, auth.type);

    const studioId = widget.studio.id;

    await client.join(this.roomName(studioId));

    await this.socketSessionManager.create(client.id, studioId);
    const settingSession = await this.getSettingSession(studioId);

    client.emit(WidgetSubChannel.Setting, settingSession);

    const widgetSession = new WidgetSession(widget.id, studioId, auth.type);
    await this.widgetSessionManager.set(studioId, client.id, widgetSession);

    const donationSession = await this.getNextDonationSession(studioId);

    if (donationSession) {
      client.emit(WidgetSubChannel.Play, donationSession);
    }
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

    await this.playSessionManager.delete(studioId);
    await this.settingSessionManager.delete(studioId);
    await this.donationSessionManager.delete(studioId);
  }

  async getNextDonationSession(studioId: number) {
    const playSession = await this.getPlaySession(studioId);

    if (playSession.status === StudioPlayStatus.Playing) {
      return;
    }

    const settingSession = await this.getSettingSession(studioId);

    if (settingSession.autoPlay === false) {
      return;
    }

    const { pointer, session } = await this.donationSessionManager.getByNotPlayed(studioId, playSession.pointer);

    if (session) {
      const playSession = await this.getPlaySession(studioId);
      await this.playSessionManager.set(studioId, playSession.setPointer(pointer).setStatus(StudioPlayStatus.Playing));
      await this.donationSessionManager.set(studioId, session.setPlayed().setStatus(DonationSessionStatus.Playing));
    }

    return session;
  }

  async playComplete(socketSession: SocketSession, command: WidgetPlayCompleteCommand) {
    const studioId = socketSession.studioId;

    const donationSession = await this.donationSessionManager.getByDonationId(studioId, command.id);
    if (donationSession === null) {
      throw new WsException('not found donation session');
    }

    const playSession = await this.getPlaySession(studioId);

    if (playSession === null) {
      throw new WsException('not found play session');
    }

    await this.playSessionManager.set(studioId, playSession.setStatus(StudioPlayStatus.Wating));
    await this.donationSessionManager.set(studioId, donationSession.setPlayed().setStatus(DonationSessionStatus.PlayComplete));

    return this.getNextDonationSession(studioId);
  }
}
