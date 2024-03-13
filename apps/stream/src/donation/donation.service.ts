import { KafkaDonationMessage } from '@libs/common';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { DonationEvent } from './constants';
import { DonationStatus, SessionService } from '../session';

@Injectable()
export class DonationService {
  constructor(private readonly sessionService: SessionService, private readonly eventEmitter: EventEmitter2) {}

  async insertDonation(message: KafkaDonationMessage) {
    const { studio, donation, sender } = message.value;
    const donationSession = await this.sessionService.createDonationSession(studio.id, donation, sender, DonationStatus.New);

    this.eventEmitter.emit(DonationEvent.Insert, studio.id, donationSession);
  }
}
