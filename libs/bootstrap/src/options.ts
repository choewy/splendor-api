import { ClassSerializerInterceptor, ExceptionFilter, INestApplication, NestInterceptor, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NextFunction, Request, Response } from 'express';

import { ValidationFailException } from './exceptions';
import { HttpExceptionFilter } from './filters';
import { HttpLog } from './implements';
import { LoggingInterceptor } from './interceptors';

export const createBootstrapOptions = (app: INestApplication) => {
  app.use((req: Request, _: Response, next: NextFunction) => {
    req['log'] = new HttpLog(req);
    next();
  });

  return {
    pipes: [
      new ValidationPipe({
        stopAtFirstError: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
          enableCircularCheck: true,
        },
        exceptionFactory(errors) {
          const message = Object.values(errors.shift().constraints).shift();
          throw new ValidationFailException(message);
        },
      }),
    ] as ValidationPipe[],
    interceptors: [
      new ClassSerializerInterceptor(app.get(Reflector), {
        enableImplicitConversion: true,
        enableCircularCheck: true,
      }),
      new LoggingInterceptor(),
    ] as NestInterceptor[],
    filters: [new HttpExceptionFilter()] as ExceptionFilter[],
  };
};
