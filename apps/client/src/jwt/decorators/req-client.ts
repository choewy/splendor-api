import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { ClientContext } from '../implements';

export const ReqClient = createParamDecorator((_, ctx: ExecutionContext): ClientContext | null => ctx.switchToHttp().getRequest().user);
