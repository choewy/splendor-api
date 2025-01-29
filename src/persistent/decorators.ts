import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';

import { RequestHeader } from './enums';

export const ApiPrivate = applyDecorators(ApiBearerAuth(RequestHeader.Authorization), ApiSecurity(RequestHeader.XRefreshToken));
