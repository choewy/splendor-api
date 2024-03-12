import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs';

import { HttpLog } from '../implements';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();

    req.context = context.getClass()?.name;
    req.handler = context.getHandler()?.name;

    return next.handle().pipe(
      tap(() => {
        const http = context.switchToHttp();
        const req = http.getRequest();
        const res = http.getResponse();
        const log = req.log as HttpLog;

        Logger.verbose(log.setUser(req.user).toSuccess(res));
      }),
    );
  }
}
