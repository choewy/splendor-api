import { JWT_CLIENT_CONFIG, JwtConfigReturnType } from '@libs/configs';
import { OAuthPlatform } from '@libs/entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { ClientTokensDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService, private readonly jwtService: JwtService) {}

  createTokens(platform: OAuthPlatform, id: number) {
    const payload = { platform, id };
    const config = this.configService.get<JwtConfigReturnType>(JWT_CLIENT_CONFIG);

    return new ClientTokensDto(
      this.jwtService.sign(payload, { ...config.access.signOptions, secret: config.access.secret }),
      this.jwtService.sign(payload, { ...config.refresh.signOptions, secret: config.refresh.secret }),
    );
  }
}
