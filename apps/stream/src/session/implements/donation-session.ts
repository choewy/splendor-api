import { DonationEntity, UserEntity } from '@libs/entity';
import { ApiResponseProperty } from '@nestjs/swagger';

import { DonationStatus } from '../constants';

class DonationSender {
  @ApiResponseProperty({ type: Number })
  readonly id: number;

  @ApiResponseProperty({ type: String })
  readonly nickname: string;

  @ApiResponseProperty({ type: String })
  readonly profileImageUrl: string;

  constructor(sender: Partial<UserEntity>) {
    this.id = sender.id;
    this.nickname = sender.nickname;
    this.profileImageUrl = sender.profileImageUrl;
  }
}

export class DonationSession {
  static readonly TTL = 60 * 60 * 24;

  static createListKey(studioId: number) {
    return ['studio', studioId, 'donations'].join(':');
  }

  static createHashKey(studioId: number) {
    return ['studio', studioId, 'donations-hash'].join(':');
  }

  @ApiResponseProperty({ type: Number })
  readonly id: number;

  @ApiResponseProperty({ type: String })
  readonly nickname: string;

  @ApiResponseProperty({ type: Number })
  readonly amount: number;

  @ApiResponseProperty({ type: String })
  readonly message: string | null;

  @ApiResponseProperty({ type: String })
  readonly imageUrl: string | null;

  @ApiResponseProperty({ type: Date })
  readonly createdAt: Date;

  @ApiResponseProperty({ type: DonationSender })
  readonly sender: DonationSender;

  @ApiResponseProperty({ type: Number, enum: [0, 1] })
  status: DonationStatus;

  constructor(donation: Partial<DonationEntity>, sender: Partial<UserEntity>, status = DonationStatus.Default) {
    this.id = donation.id;
    this.nickname = donation.nickname;
    this.message = donation.message;
    this.imageUrl = donation.imageUrl;
    this.createdAt = new Date(donation.createdAt);
    this.sender = new DonationSender(sender);
    this.status = status;
  }

  setStatus(status: DonationStatus) {
    this.status = status;
    return this;
  }
}
