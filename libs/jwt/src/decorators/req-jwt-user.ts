import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ReqJwtUser = createParamDecorator(
  (_, ctx: ExecutionContext): number | null => ctx.switchToHttp().getRequest().user?.id ?? null,
);
