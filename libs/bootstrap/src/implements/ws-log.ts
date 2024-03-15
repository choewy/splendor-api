import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

export class WsLog {
  private incomingTime = Date.now();

  id: string;
  auth: unknown;
  rooms: string[];
  context: string;
  handler: string;
  pattern: string;
  incomingPayload: unknown;
  outgoingPayload: unknown;
  ip: string;
  xforwaredfor: string;
  message = '';
  latency: number;
  error?: object;
  exception?: WsException;

  constructor(client: Socket) {
    this.id = client.id;
    this.auth = client.handshake.auth;
    this.rooms = Array.from(client.rooms);
    this.context = client['context'];
    this.handler = client['handler'];
    this.pattern = client['pattern'];
    this.incomingPayload = client['payload'];
    this.ip = client.handshake.address;
    this.xforwaredfor = client.handshake.headers['x-forwarded-for'] as string;
  }

  private end() {
    this.latency = Date.now() - this.incomingTime;
    delete this.incomingTime;
    return this;
  }

  toSuccess(payload?: unknown) {
    this.message = 'OK';
    this.outgoingPayload = payload;
    return this.end();
  }

  toException(exception: WsException, error?: Error) {
    this.message = exception.message;
    this.exception = exception;

    if (error) {
      this.error = { name: error.name, message: error.message, stack: error.stack };
    }

    return this.end();
  }
}
