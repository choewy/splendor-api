import { WsExceptionDto, WsExceptionFilter, WsLoggingInterceptor } from '@libs/bootstrap';
import { AsyncApiEvent, AsyncApiException } from '@libs/docs';
import { UseFilters, UseInterceptors } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';

import { WidgetPlayCompleteCommand } from './commands';
import { WidgetPubChannel, WidgetSubChannel } from './constants';
import { WidgetService } from './widget.service';
import { DonationSession, StudioSettingSession } from '../session';

@WebSocketGateway({ namespace: 'widget' })
@UseFilters(WsExceptionFilter)
@UseInterceptors(WsLoggingInterceptor)
export class WidgetGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly nsp: Namespace;

  constructor(private readonly widgetService: WidgetService) {}

  async handleConnection(client: Socket) {
    try {
      await this.widgetService.createSession(client);
    } catch (e) {
      this.asendException(client, e, true);
    }
  }

  async handleDisconnect(client: Socket) {
    await this.widgetService.deleteSession(client);
  }

  @AsyncApiException({
    summary: '예외 발생',
    channel: WidgetSubChannel.Exception,
  })
  asendException(client: Socket, exception: WsException, disconnect?: boolean) {
    client.emit(WidgetSubChannel.Exception, new WsExceptionDto(exception));

    if (disconnect) {
      client.disconnect(true);
    }
  }

  @AsyncApiEvent({
    type: 'sub',
    summary: '설정 동기화',
    channel: WidgetSubChannel.Setting,
    payload: StudioSettingSession,
  })
  sendSetting(studioId: number, session: StudioSettingSession) {
    this.nsp.in([this.widgetService.roomName(studioId)]).emit(WidgetSubChannel.Setting, session);
  }

  @AsyncApiEvent({
    type: 'sub',
    summary: '재생',
    channel: WidgetSubChannel.Play,
  })
  async sendPlay(studioId: number, session: DonationSession) {
    this.nsp.in(this.widgetService.roomName(studioId)).emit(WidgetSubChannel.Play, session);
  }

  @AsyncApiEvent({
    type: 'sub',
    summary: '재생 초기화',
    channel: WidgetSubChannel.Play,
  })
  async sendClear(studioId: number) {
    this.nsp.in(this.widgetService.roomName(studioId)).emit(WidgetSubChannel.Clear);
  }

  @AsyncApiEvent({
    type: 'pub',
    summary: '재생 완료',
    channel: WidgetPubChannel.PlayComplete,
    payload: WidgetPlayCompleteCommand,
  })
  @SubscribeMessage(WidgetPubChannel.PlayComplete)
  async onPlayComplate(@ConnectedSocket() client: Socket, @MessageBody() command: WidgetPlayCompleteCommand) {
    const socketSession = await this.widgetService.getSocketSession(client.id);
    const nextDonationSession = await this.widgetService.playComplete(socketSession, command);

    this.sendClear(socketSession.studioId);

    if (nextDonationSession) {
      this.sendPlay(socketSession.studioId, nextDonationSession);
    }
  }
}
