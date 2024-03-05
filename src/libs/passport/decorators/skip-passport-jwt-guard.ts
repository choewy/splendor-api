import { SetMetadata } from '@nestjs/common';

export const SKIP_PASSPORT_JWT_GUARD_METADATA_KEY = '__skip_passport_jwt_guard__';
export const SkipPassportJwtGuard = () => SetMetadata(SKIP_PASSPORT_JWT_GUARD_METADATA_KEY, true);
