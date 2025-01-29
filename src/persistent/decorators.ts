import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';

import { MetadataKey, RequestHeader } from './enums';

export const ApiPrivate = applyDecorators(
  ApiBearerAuth(RequestHeader.Authorization),
  ApiSecurity(RequestHeader.XRefreshToken),
  SetMetadata(MetadataKey.RequiredJWTAuthGuard, true),
);
