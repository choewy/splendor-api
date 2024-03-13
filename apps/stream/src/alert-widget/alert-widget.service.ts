import { AlertWidgetRepository } from '@libs/entity';
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

import { AlertWidgetPlayCompleteCommand } from './commands';
import { AlertWidgetGatewayPubEvent } from './constants';
import { DonationStatus, SessionService, SessionStatus } from '../session';

@Injectable()
export class AlertWidgetService {
  constructor(private readonly alertWidgetRepository: AlertWidgetRepository, private readonly sessionService: SessionService) {}

  createStudioRoom(studioId: number) {
    return ['studio', studioId].join(':');
  }

  async handleConnection(client: Socket) {
    const id = client.handshake.query.id;

    if (id == null || typeof id !== 'string') {
      return client.disconnect(true);
    }

    const alertWidget = await this.alertWidgetRepository.findOne({
      relations: { studio: { studioPlaySetting: true } },
      where: { id },
    });

    if (alertWidget === null) {
      return client.disconnect(true);
    }

    const studioId = alertWidget.studio.id;
    const playSetting = alertWidget.studio.studioPlaySetting;
    const playSettingSession = await this.sessionService.createPlaySettingSession(playSetting);

    client.emit(AlertWidgetGatewayPubEvent.PlaySetting, playSettingSession);

    await this.sessionService.createSocketSession(studioId, client.id);
    await this.sessionService.createWidgetSession(studioId, client.id, 'alert');

    await client.join(this.createStudioRoom(studioId));
  }

  async handleDisconnection(client: Socket) {
    await this.sessionService.deleteWidgetSession(client.id);
  }

  async playComplete(client: Socket, command: AlertWidgetPlayCompleteCommand) {
    const socketSession = await this.sessionService.getSocketSession(client.id);

    if (socketSession === null) {
      return;
    }

    const studioId = socketSession.studioId;
    const widgetSession = await this.sessionService.getWidgetSession(studioId, client.id);

    if (widgetSession === null) {
      return;
    }

    await this.sessionService.updateWidgetSession(studioId, client.id, widgetSession.setHash('').setStatus(SessionStatus.PlayComplete));

    const donation = await this.sessionService.getDonationSession(studioId, command.id);

    if (donation === null || donation.status === DonationStatus.Default) {
      return;
    }

    await this.sessionService.updateDonationSession(studioId, donation.setStatus(DonationStatus.Default));
  }
}
