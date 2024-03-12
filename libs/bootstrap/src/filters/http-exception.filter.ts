import { ArgumentsHost, Catch, HttpException, InternalServerErrorException, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { HttpExceptionDto } from '../dtos';
import { HttpLog } from '../implements';

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
  catch(e: Error | HttpException, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const req = http.getRequest();
    const res = http.getResponse();
    const log = (req.log as HttpLog).setUser(req.user);

    let exception = e as HttpException;

    if (e instanceof HttpException === false) {
      exception = new InternalServerErrorException();
      exception.cause = { name: e.name, message: e.message };

      Logger.error(log.toException(exception, e));
    } else {
      Logger.warn(log.toException(exception));
    }

    res.status(exception.getStatus()).send(new HttpExceptionDto(exception));
  }
}
