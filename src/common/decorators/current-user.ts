import { OAuthPlatform } from '@entities/oauth.entity';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtPayload } from 'jsonwebtoken';

export class CurrentUserClaim {
  constructor(readonly id: number, readonly platform: OAuthPlatform) {}

  static to(id: number, platform: OAuthPlatform) {
    return { id, platform };
  }

  static from(payload: JwtPayload) {
    console.log(payload);

    if (Object.hasOwn(payload, 'id') && Object.hasOwn(payload, 'platform')) {
      return new CurrentUserClaim(payload.id, payload.platform);
    } else {
      return null;
    }
  }
}

export const CurrentUser = createParamDecorator((_, ctx: ExecutionContext): CurrentUserClaim | null => {
  return CurrentUserClaim.from(ctx.switchToHttp().getRequest().user);
});
