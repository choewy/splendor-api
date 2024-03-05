import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { PassportJwtValidateResult } from '../classes';

export const ReqJwtPayload = createParamDecorator(
  (_: unknown, context: ExecutionContext): PassportJwtValidateResult | null => context.switchToHttp().getRequest().user ?? null,
);
