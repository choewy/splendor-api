import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs';

import { ContextService } from '../context/context.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly contextService: ContextService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    this.contextService.executionContext = context;

    return next.handle().pipe(tap(() => Logger.verbose(JSON.stringify(this.contextService.getRequestLog(), null, 2))));
  }
}
