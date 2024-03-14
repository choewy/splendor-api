import { KafkaDonationMessage } from '@libs/common';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { DonationEvent } from './constants';
import { DonationSession, DonationSessionManager } from '../session';

@Injectable()
export class DonationService {
  constructor(private readonly eventEmitter: EventEmitter2, private readonly donationSessionManager: DonationSessionManager) {}

  async registDonation(message: KafkaDonationMessage) {
    const studioId = message.value.studio.id;
    const donation = message.value.donation;
    const sender = message.value.sender;
    const session = await this.donationSessionManager.push(studioId, new DonationSession(donation, sender));

    this.eventEmitter.emit(DonationEvent.Regist, studioId, session);
  }
}
