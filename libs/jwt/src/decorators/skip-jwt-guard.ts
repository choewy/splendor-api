import { SetMetadata } from '@nestjs/common';

export const SKIP_JWT_GUARD = '__skip_jwt_guard__';
export const SkipJwtGuard = () => SetMetadata(SKIP_JWT_GUARD, true);
