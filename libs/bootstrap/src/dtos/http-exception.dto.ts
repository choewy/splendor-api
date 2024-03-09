import { HttpException } from '@nestjs/common';

import { HttpExceptionErrorDto } from './http-exception-error.dto';

export class HttpExceptionDto {
  name: string;
  message: string;
  statusCode: number;
  error: HttpExceptionErrorDto | null;

  constructor(e: HttpException) {
    this.name = e.name;
    this.message = e.message;
    this.statusCode = e.getStatus();
    this.error = e.cause ? new HttpExceptionErrorDto(e.cause) : null;
  }
}
