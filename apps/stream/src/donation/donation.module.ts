import { Module } from '@nestjs/common';

import { DonationEventController } from './donation-event.controller';
import { DonationService } from './donation.service';

@Module({ providers: [DonationService, DonationEventController] })
export class DonationModule {}
