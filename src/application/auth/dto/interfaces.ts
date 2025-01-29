import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { OAuthPlatform } from 'src/domain/enums';

export interface JwtAccessPayload extends JwtPayload {
  id: string;
  platform: OAuthPlatform;
  oauthId: string;
}

export interface JwtRefreshPayload extends JwtPayload {
  signature: string;
}

export interface JwtVerifyResult<T> {
  payload: T | null;
  error: JsonWebTokenError | TokenExpiredError | null;
}
