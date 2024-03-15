import { WsExceptionDto, WsExceptionFilter, WsLoggingInterceptor } from '@libs/bootstrap';
import { AsyncApiEvent, AsyncApiException } from '@libs/docs';
import { UseFilters, UseInterceptors } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';

import { WidgetPubChannel, WidgetSubChannel } from './constants';
import { WidgetService } from './widget.service';
import { StudioSettingSession } from '../session';

@WebSocketGateway({ namespace: 'widget' })
@UseFilters(WsExceptionFilter)
@UseInterceptors(WsLoggingInterceptor)
export class WidgetGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly nsp: Namespace;

  constructor(private readonly widgetService: WidgetService) {}

  protected roomName(studioId: number) {
    return ['studio', studioId].join('_');
  }

  async handleConnection(client: Socket) {
    try {
      const session = await this.widgetService.createSession(client);
      await client.join(this.roomName(session.studioId));

      client.emit('connect:ack');
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
    type: 'pub',
    summary: '설정 조회',
    channel: WidgetPubChannel.Setting,
  })
  @SubscribeMessage(WidgetPubChannel.Setting)
  async onSetting(@ConnectedSocket() client: Socket) {
    return this.widgetService.getSetting(client);
  }

  @AsyncApiEvent({
    type: 'sub',
    summary: '설정 변경 동기화',
    channel: WidgetSubChannel.Setting,
    payload: StudioSettingSession,
  })
  sendSetting(studioId: number, session: StudioSettingSession) {
    this.nsp.in([this.roomName(studioId)]).emit(WidgetSubChannel.Setting, session);
  }

  @AsyncApiEvent({
    type: 'pub',
    summary: '재생 완료',
    channel: 'complete',
  })
  async onPlayComplate() {
    return null;
  }
}
