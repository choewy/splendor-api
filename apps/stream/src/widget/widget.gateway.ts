import { OnEvent } from '@nestjs/event-emitter';
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { AsyncApiSub } from 'nestjs-asyncapi';
import { Namespace, Socket } from 'socket.io';

import { WidgetGatewaySubEvent } from './constants';
import { WidgetService } from './widget.service';
import { StudioSettingSession } from '../session';
import { SettingEvent } from '../setting';

@WebSocketGateway({ namespace: 'widget' })
export class WidgetGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly nsp: Namespace;

  constructor(private readonly widgetService: WidgetService) {}

  async handleConnection(client: Socket) {
    await this.widgetService.handleConnection(client);
  }

  async handleDisconnect(client: Socket) {
    await this.widgetService.handleDisconnection(client);
  }

  @AsyncApiSub({
    summary: '설정 변경 동기화',
    channel: WidgetGatewaySubEvent.Setting,
    message: { payload: StudioSettingSession },
  })
  @OnEvent(SettingEvent.Change)
  onPlaySetting(studioId: number, settingSession: StudioSettingSession) {
    this.nsp.in([this.widgetService.createStudioRoom(studioId)]).emit(WidgetGatewaySubEvent.Setting, settingSession);
  }
}
