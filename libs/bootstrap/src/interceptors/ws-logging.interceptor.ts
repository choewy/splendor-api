import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs';

import { WsLog } from '../implements';

@Injectable()
export class WsLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const ws = context.switchToWs();
    const client = ws.getClient();

    client.context = context.getClass()?.name;
    client.handler = context.getHandler()?.name;
    client.pattern = ws.getPattern();
    client.payload = ws.getData();
    client.log = new WsLog(client);

    return next.handle().pipe(
      tap((data) => {
        const ws = context.switchToWs();
        const client = ws.getClient();
        const log = client.log as WsLog;

        Logger.verbose(log.toSuccess(data));
      }),
    );
  }
}
