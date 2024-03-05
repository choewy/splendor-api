import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { PassportJwtPayload } from '../implements';

export const ReqJwtPayload = createParamDecorator(
  (_: unknown, context: ExecutionContext): PassportJwtPayload | null => context.switchToHttp().getRequest().user ?? null,
);
