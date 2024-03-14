import { ApiResponseProperty } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

export enum StudioSessionPlayStatus {
  Wating = 0,
  Playing = 1,
}

export class StudioPlaySession {
  @ApiResponseProperty({ type: Number })
  pointer = -1;

  @ApiResponseProperty({ type: Number, enum: StudioSessionPlayStatus })
  status = StudioSessionPlayStatus.Wating;

  setPointer(pointer: number) {
    this.pointer = pointer;
    return this;
  }

  setStatus(status: StudioSessionPlayStatus) {
    this.status = status;
    return this;
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
