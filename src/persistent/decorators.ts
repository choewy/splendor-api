import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';

import { MetadataKey, RequestHeader } from './enums';

export const RequiredJwtGuard = () =>
  applyDecorators(ApiBearerAuth(RequestHeader.Authorization), ApiSecurity(RequestHeader.XRefreshToken), SetMetadata(MetadataKey.RequiredJwtAuthGuard, true));

export const RequiredPlayerGuard = () => applyDecorators(SetMetadata(MetadataKey.RequiredPlayerAuthGuard, true));
export const RequiredEmptyPlayerGuard = () => applyDecorators(SetMetadata(MetadataKey.RequiredEmptyPlayerAuthGuard, true));
