import { plainToInstance } from 'class-transformer';

export enum WidgetType {
  Alert = 'alert',
}

export class WidgetSession {
  readonly id: string;
  readonly studioId: number;
  readonly type: WidgetType;
  updatedAt = new Date();

  constructor(id?: string, studioId?: number, type?: WidgetType) {
    if (id) {
      this.id = id;
    }

    if (studioId) {
      this.studioId = studioId;
    }

    if (type) {
      this.type = type;
    }
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
