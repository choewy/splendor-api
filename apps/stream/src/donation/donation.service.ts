import { KafkaDonationMessage } from '@libs/common';
import { EventService } from '@libs/event';
import { Injectable } from '@nestjs/common';

import { DonationRegisteredEvent } from './events';
import { DonationSession, DonationSessionManager } from '../session';

@Injectable()
export class DonationService {
  constructor(private readonly eventService: EventService, private readonly donationSessionManager: DonationSessionManager) {}

  async registDonation(message: KafkaDonationMessage) {
    const studioId = message.value.studio.id;
    const donation = message.value.donation;
    const sender = message.value.sender;
    const session = await this.donationSessionManager.push(studioId, new DonationSession(donation, sender));

    this.eventService.send(new DonationRegisteredEvent(studioId, session));
  }
}
