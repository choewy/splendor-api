import { plainToInstance } from 'class-transformer';

export enum WidgetType {
  Alert = 'alert',
}

export enum WidgetSessionStatus {
  Wating = 0,
  Playing = 1,
  PlayComplete = 2,
}

export class WidgetSession {
  readonly type: WidgetType;

  donationId: number | null = null;
  status = WidgetSessionStatus.Wating;
  updatedAt = new Date();

  constructor(type: WidgetType) {
    this.type = type;
  }

  setDonationId(donationId: number | null) {
    this.donationId = donationId;
    this.updatedAt = new Date();

    return this;
  }

  setStatus(status: WidgetSessionStatus) {
    this.status = status;
    this.updatedAt = new Date();

    return this;
  }

  stringify() {
    return JSON.stringify(this, null, 2);
  }

  toHash(socketId: string) {
    return { [socketId]: this.stringify() };
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
}
