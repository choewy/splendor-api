import { JwtPayload } from 'jsonwebtoken';

export class PassportJwtPayload {
  readonly userId: number;
  readonly platform: string;
  readonly nickname: string;

  constructor(payload: JwtPayload) {
    this.userId = payload.userId;
    this.platform = payload.platform;
    this.nickname = payload.nickname;
  }
}
