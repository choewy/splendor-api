import { HttpException } from '@nestjs/common';

export class HttpExceptionDto {
  name: string;
  message: string;
  statusCode: number;
  error?: object;

  constructor(e: HttpException) {
    this.name = e.name;
    this.message = e.message;
    this.statusCode = e.getStatus();

    if (e.cause instanceof Error) {
      this.error = {
        name: e.cause.name,
        message: e.cause.message,
        cause: e.cause.cause,
      };
    } else if (typeof e.cause === 'object') {
      this.error = e.cause;
    }
  }
}
