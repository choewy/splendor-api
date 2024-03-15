import { plainToInstance } from 'class-transformer';

export class SocketSession {
  readonly studioId: number;
  readonly connectedAt: Date;

  constructor(studioId?: number) {
    if (studioId) {
      this.studioId = studioId;
      this.connectedAt = new Date();
    }
  }

  stringify() {
    return JSON.stringify(this, null, 2);
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
