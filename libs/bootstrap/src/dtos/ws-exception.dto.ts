import { WsException } from '@nestjs/websockets';

export class WsExceptionDto {
  name: string;
  message: string;
  cause?: object;
  error?: object;

  constructor(e: WsException) {
    this.name = e.name;
    this.message = e.message;

    const cause = e.cause;

    if (cause instanceof Error) {
      this.cause = {
        name: cause.name,
        message: cause.message,
        cause: cause,
      };
    } else if (typeof e.cause === 'object') {
      this.cause = e.cause;
    }

    const error = e.getError();

    if (error instanceof Error) {
      this.error = {
        name: error.name,
        message: error.message,
        cause: error.cause,
      };
    } else if (typeof error === 'string') {
      this.error = { name: error };
    }
  }
}
