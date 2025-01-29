import { ExecutionContext, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { ContextPropertyKey } from 'src/persistent/enums';

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
}
