import { JwtPayload } from 'jsonwebtoken';

export class PassportJwtValidateResult {
  readonly userId: number;
  readonly nickname: string;

  constructor(payload: JwtPayload) {
    this.userId = +payload.sub;
    this.nickname = payload.nickname;
  }
}
