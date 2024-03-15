import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { WsLog } from '../implements';

@Catch()
export class WsExceptionFilter extends BaseExceptionFilter {
  catch(e: Error | WsException, host: ArgumentsHost): void {
    const ws = host.switchToWs();
    const client = ws.getClient<Socket>();
    const log = client['log'] as WsLog;

    let exception = e as WsException;

    if (e instanceof WsException === false) {
      exception = new WsException(e);
      exception.cause = { name: e.name, message: e.message };

      Logger.error(log.toException(exception, e));
    } else {
      Logger.warn(log.toException(exception));
    }

    client.emit('exception', exception);
  }
}
