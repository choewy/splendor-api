import { DynamicModule, Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { ContextPropertyKey, RequestHeader, ResponseHeader } from 'src/persistent/enums';
import { v4 } from 'uuid';

import { ContextService } from './context.service';

@Module({})
export class ContextModule {
  public static forRoot(): DynamicModule {
    return {
      imports: [
        ClsModule.forRoot({
          middleware: {
            mount: true,
            setup(clsService, req, res) {
              req.id = req.get(RequestHeader.XRequestId) ?? v4();
              res.set(ResponseHeader.XRequestId, req.id);
              clsService.set(ContextPropertyKey.RequestId, req.id);
              clsService.set(ContextPropertyKey.RequestTimestamp, Date.now());
            },
          },
        }),
      ],
      providers: [ContextService],
      exports: [ContextService],
      module: ContextModule,
      global: true,
    };
  }
}
