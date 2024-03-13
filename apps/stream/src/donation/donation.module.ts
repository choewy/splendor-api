import { Module } from '@nestjs/common';

import { DonationMessageController } from './donation-message.controller';
import { DonationService } from './donation.service';

@Module({
  providers: [DonationService, DonationMessageController],
})
export class DonationModule {}
