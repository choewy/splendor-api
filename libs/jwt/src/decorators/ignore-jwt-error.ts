import { SetMetadata } from '@nestjs/common';

export const IGNORE_JWT_ERROR = '__ignore_jwt_error__';
export const IgnoreJwtError = () => SetMetadata(IGNORE_JWT_ERROR, true);
