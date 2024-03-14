import { OnLibsEvent } from '@libs/event';
import { Injectable } from '@nestjs/common';

import { WidgetGateway } from './widget.gateway';
import { SettingChangedEvent } from '../setting';

@Injectable()
export class WidgetEventController {
  constructor(private readonly widgetGateway: WidgetGateway) {}

  @OnLibsEvent(SettingChangedEvent)
  onChangeSetting(event: SettingChangedEvent) {
    this.widgetGateway.sendSetting(event.studioId, event.session);
  }
}
