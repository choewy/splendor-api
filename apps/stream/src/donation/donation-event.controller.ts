import { KafkaDonationMessage, KafkaTopics } from '@libs/common';
import { KafkaMessagePayload, OnKafkaTopic } from '@libs/kafka';
import { Injectable } from '@nestjs/common';

import { DonationService } from './donation.service';

@Injectable()
export class DonationEventController {
  constructor(private readonly donationService: DonationService) {}

  @OnKafkaTopic(KafkaTopics.Donation)
  async onDonation(payload: KafkaMessagePayload<KafkaDonationMessage>) {
    await this.donationService.registDonation(payload.message);
  }
}
