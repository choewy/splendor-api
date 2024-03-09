import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { tap } from 'rxjs';

import { HttpLogDto } from '../dtos';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    context.switchToHttp().getRequest().context = context.getClass()?.name;
    context.switchToHttp().getRequest().handler = context.getHandler()?.name;

    return next.handle().pipe(
      tap(() => {
        const http = context.switchToHttp();
        const log = new HttpLogDto(http.getRequest<Request>());

        Logger.verbose(log.toSuccess(http.getResponse<Response>()));
      }),
    );
  }
}
