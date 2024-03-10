import { OAuthPlatform } from '@libs/entity';
import { Request } from 'express';

export class ClientTokenPayload {
  constructor(readonly id: number, readonly platform: OAuthPlatform) {}

  static fromReq(req: Request) {
    return req.user == null ? null : new ClientTokenPayload(req.user['id'], req.user['platform']);
  }

  plainObject() {
    return { id: this.id, platform: this.platform };
  }
}
