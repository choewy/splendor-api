import { ArgumentsHost, Catch, HttpException, InternalServerErrorException, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';

import { HttpExceptionDto, HttpLogDto } from '../dtos';

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
  catch(e: Error | HttpException, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const log = new HttpLogDto(http.getRequest<Request>());

    let exception = e as HttpException;

    if (e instanceof HttpException === false) {
      exception = new InternalServerErrorException();
      exception.cause = { name: e.name, message: e.message };

      Logger.error(log.toException(exception, e));
    } else {
      Logger.warn(log.toException(exception));
    }

    host.switchToHttp().getResponse<Response>().status(exception.getStatus()).send(new HttpExceptionDto(exception));
  }
}
