import { OnModuleDestroy } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { AsyncApiPub, AsyncApiSub } from 'nestjs-asyncapi';
import { Namespace, Socket } from 'socket.io';

import { AlertWidgetService } from './alert-widget.service';
import { AlertWidgetPlayCompleteCommand } from './commands';
import { AlertWidgetGatewayPubEvent, AlertWidgetGatewaySubEvent } from './constants';
import { DonationEvent } from '../donation';
import { PlaySettingEvent } from '../play-setting';
import { DonationSession, PlaySettingSession } from '../session';

@WebSocketGateway({ namespace: 'alert' })
export class AlertWidgetGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleDestroy {
  @WebSocketServer()
  private readonly server: Namespace;

  constructor(private readonly alertWidgetService: AlertWidgetService) {}

  async onModuleDestroy() {
    for (const [, client] of Array.from(this.server.sockets)) {
      await this.alertWidgetService.handleDisconnection(client);
      client.disconnect(true);
    }
  }

  createStudioRoom(id: number) {
    return ['studio', id].join(':');
  }

  async handleConnection(client: Socket) {
    await this.alertWidgetService.handleConnection(client);
  }

  async handleDisconnect(client: Socket) {
    await this.alertWidgetService.handleDisconnection(client);
  }

  @AsyncApiSub({
    summary: '재생 설정 전달',
    channel: AlertWidgetGatewayPubEvent.PlaySetting,
    message: { payload: PlaySettingSession },
  })
  @OnEvent(PlaySettingEvent.Change)
  onPlaySetting(studioId: number, playSettingSession: PlaySettingSession) {
    this.server.in([this.alertWidgetService.createStudioRoom(studioId)]).emit(AlertWidgetGatewayPubEvent.PlaySetting, playSettingSession);
  }

  @AsyncApiSub({
    summary: '재생 항목 추가',
    channel: AlertWidgetGatewayPubEvent.PlayTarget,
    message: { payload: DonationSession },
  })
  @OnEvent(DonationEvent.Insert)
  sendPlayTarget(studioId: number, donationSession: DonationSession) {
    this.server.in(this.alertWidgetService.createStudioRoom(studioId)).emit(AlertWidgetGatewayPubEvent.PlayTarget, donationSession);
  }

  @AsyncApiPub({
    summary: '재생 완료',
    channel: AlertWidgetGatewaySubEvent.PlayComplete,
    message: { payload: AlertWidgetPlayCompleteCommand },
  })
  async onPlayComplete(@ConnectedSocket() client: Socket, @MessageBody() command: AlertWidgetPlayCompleteCommand) {
    await this.alertWidgetService.playComplete(client, command);
  }
}
