import { ExecutionContext, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { OAuth } from 'src/domain/entities/oauth.entity';
import { ContextPropertyKey, RequestHeader } from 'src/persistent/enums';

@Injectable()
export class ContextService {
  constructor(private readonly clsService: ClsService) {}

  get requestId(): string {
    return this.clsService.get(ContextPropertyKey.RequestId);
  }

  set requestId(requestId: string) {
    this.clsService.set(ContextPropertyKey.RequestId, requestId);
  }

  get requestTimestamp(): number {
    return this.clsService.get(ContextPropertyKey.RequestTimestamp);
  }

  set requestTimestamp(requestTimestamp: number) {
    this.clsService.set(ContextPropertyKey.RequestTimestamp, requestTimestamp);
  }

  get executionContext(): ExecutionContext {
    return this.clsService.get(ContextPropertyKey.ExecutionContext);
  }

  set executionContext(executionContext: ExecutionContext) {
    this.clsService.set(ContextPropertyKey.ExecutionContext, executionContext);
  }

  get requestUser() {
    return this.clsService.get(ContextPropertyKey.RequestUser) ?? null;
  }

  set requestUser(oauth: OAuth) {
    this.clsService.set(ContextPropertyKey.RequestUser, oauth);
  }

  getRequestLog(exception?: unknown) {
    if (!this.executionContext) {
      return null;
    }

    const request = this.executionContext.switchToHttp().getRequest();
    const log: Record<string, unknown> = {
      id: this.requestId,
      ip: request.headers[RequestHeader.XForwarededFor] ?? request.ip,
      method: request.method,
      path: request.path + (Object.values(request.params).length > 0 ? `/${Object.values(request.params)}` : ''),
    };

    if (Object.keys(request.query).length > 0) {
      log.query = request.query;
    }

    if (exception) {
      log.exception = exception;
    }

    log.latency = (Date.now() - (this.requestTimestamp ?? Date.now())) / 1000;

    return log;
  }
}
