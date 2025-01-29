import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuth } from 'src/domain/entities/oauth.entity';
import { OAuthPlatform } from 'src/domain/enums';
import { DataSource } from 'typeorm';

import { IssueTokenDTO } from './dto/issue-token.dto';
import { ServiceTokenDTO } from './dto/service-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private issueAccessToken(oauth: OAuth) {
    return this.jwtService.sign(
      {
        platform: oauth.platform,
        oauthId: oauth.oauthId,
      },
      {
        secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
        expiresIn: '10m',
      },
    );
  }

  private issueRefreshToken(accessToken: string) {
    return this.jwtService.sign(
      { signature: accessToken.split('.').pop() },
      {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: '14d',
      },
    );
  }

  async issueToken(body: IssueTokenDTO) {
    const oauthRepository = this.dataSource.getRepository(OAuth);
    const oauth = await oauthRepository.findOne({
      relations: { user: true },
      where: { id: body.id },
    });

    if (!oauth) {
      throw new UnauthorizedException();
    }

    const accessToken = this.issueAccessToken(oauth);
    const refreshToken = this.issueRefreshToken(accessToken);

    return new ServiceTokenDTO(accessToken, refreshToken);
  }

  async refreshTokens(platform: OAuthPlatform, oauthId: string) {
    const oauthRepository = this.dataSource.getRepository(OAuth);
    const oauth = await oauthRepository.findOne({
      relations: { user: true },
      where: { platform, oauthId },
    });

    if (!oauth) {
      throw new UnauthorizedException();
    }

    const accessToken = this.issueAccessToken(oauth);
    const refreshToken = this.issueRefreshToken(accessToken);

    return new ServiceTokenDTO(accessToken, refreshToken);
  }
}
