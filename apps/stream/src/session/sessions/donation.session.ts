import { DonationEntity, UserEntity } from '@libs/entity';
import { ApiResponseProperty } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

export enum DonationSessionStatus {
  Wating = 0,
  Playing = 1,
  PlayComplete = 2,
}

export class DonationSession {
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

  @ApiResponseProperty({ type: Number })
  readonly senderId: number;

  @ApiResponseProperty({ type: String })
  readonly senderNickname: string;

  @ApiResponseProperty({ type: String })
  readonly senderProfileImageUrl: string;

  @ApiResponseProperty({ type: Boolean })
  hasPlayed: boolean;

  @ApiResponseProperty({ type: Number, enum: DonationSessionStatus })
  status: DonationSessionStatus;

  constructor(
    donation?: Partial<DonationEntity>,
    sender?: Partial<UserEntity>,
    values?: {
      hasPlayed?: boolean;
      status?: DonationSessionStatus;
    },
  ) {
    if (donation) {
      this.id = donation.id;
      this.nickname = donation.nickname;
      this.message = donation.message;
      this.imageUrl = donation.imageUrl;
      this.createdAt = new Date(donation.createdAt);
    }

    if (sender) {
      this.senderId = sender.id;
      this.senderNickname = sender.nickname;
    }

    if (values) {
      this.status = values.status ?? DonationSessionStatus.Wating;
      this.hasPlayed = values.hasPlayed ?? false;
    }
  }

  setPlayed() {
    this.hasPlayed = true;
    return this;
  }

  setStatus(status: DonationSessionStatus) {
    this.status = status;
    return this;
  }

  stringify() {
    return JSON.stringify(this, null, 2);
  }

  toHash(index: number) {
    return { [this.id]: index - 1 };
  }

  static toInstance(plainText: string) {
    if (plainText === null) {
      return null;
    }

    try {
      return plainToInstance(this, JSON.parse(plainText), {
        enableCircularCheck: true,
        enableImplicitConversion: true,
      });
    } catch {
      return null;
    }
  }

  static toIndex(plainText: string) {
    if (plainText === null) {
      return null;
    }

    try {
      const index = Number(plainText);
      return typeof index === 'number' ? index : null;
    } catch {
      return null;
    }
  }
}
