import { SetMetadata } from '@nestjs/common';

export const IGNORE_CLIENT_JWT_ERROR = '__ignore_client_jwt_error__';
export const IgnoreClientJwtError = () => SetMetadata(IGNORE_CLIENT_JWT_ERROR, true);
