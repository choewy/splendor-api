import { HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

export class HttpLog {
  private incomingTime = Date.now();

  context: string;
  handler: string;
  method: string;
  path: string;
  params: Record<string, any>;
  query: Record<string, any>;
  ip: string;
  xforwaredfor: string;
  user?: object;
  message = '';
  status = -1;
  latency: number;
  error?: object;
  exception?: HttpException;

  constructor(req: Request) {
    this.context = req['context'];
    this.handler = (req['context'] ? [req['context'], req['handler']] : [req['handler']]).join('.');
    this.method = req.method;
    this.path = req.path;
    this.params = req.params;
    this.query = req.query;
    this.ip = req.ip;
    this.xforwaredfor = req.header['x-forwared-for'];
  }

  private end() {
    this.latency = Date.now() - this.incomingTime;
    delete this.incomingTime;
    return this;
  }

  setUser(user?: object) {
    this.user = user;

    return this;
  }

  toSuccess(res: Response) {
    const [message, status] = Object.entries(HttpStatus).find(([, v]) => v === res.statusCode) ?? [-1, ''];

    this.message = String(message);
    this.status = Number(status);

    return this.end();
  }

  toException(exception: HttpException, error?: Error) {
    this.message = exception.name;
    this.status = exception.getStatus();
    this.exception = exception;

    if (error) {
      this.error = { name: error.name, message: error.message, stack: error.stack };
    }

    return this.end();
  }
}
