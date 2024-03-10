import { OAuthPlatform } from '@libs/entity';

export class ClientContext {
  constructor(readonly id: number, readonly platform: OAuthPlatform) {}

  toPlainObject() {
    return { id: this.id, platform: this.platform };
  }
}
