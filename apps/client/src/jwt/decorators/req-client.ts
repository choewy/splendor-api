import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { ClientTokenPayload } from '../implements';

export const ReqClient = createParamDecorator((_, ctx: ExecutionContext): ClientTokenPayload | null =>
  ClientTokenPayload.fromReq(ctx.switchToHttp().getRequest()),
);
