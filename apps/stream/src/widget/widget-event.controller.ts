import { OnLibsEvent } from '@libs/event';
import { Injectable } from '@nestjs/common';

import { WidgetGateway } from './widget.gateway';
import { WidgetService } from './widget.service';
import { DonationRegisteredEvent } from '../donation';
import { SettingChangedEvent } from '../setting';

@Injectable()
export class WidgetEventController {
  constructor(private readonly widgetGateway: WidgetGateway, private readonly widgetService: WidgetService) {}

  @OnLibsEvent(SettingChangedEvent)
  onChangeSetting(event: SettingChangedEvent) {
    this.widgetGateway.sendSetting(event.studioId, event.session);
  }

  @OnLibsEvent(DonationRegisteredEvent)
  async onRegisterDonation(event: DonationRegisteredEvent) {
    const session = await this.widgetService.getNextDonationSession(event.studioId);

    if (session) {
      this.widgetGateway.sendPlay(event.studioId, session);
    }
  }
}
