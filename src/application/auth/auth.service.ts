import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { ContextService } from 'src/core/context/context.service';
import { OAuth } from 'src/domain/entities/oauth.entity';
import { Player } from 'src/domain/entities/player.entity';
import { PlayerStatus } from 'src/domain/enums';
import { DataSource } from 'typeorm';

import { AuthDTO } from './dto/auth.dto';
import { JwtAccessPayload, JwtRefreshPayload, JwtVerifyResult } from './dto/interfaces';
import { ServiceTokenDTO } from './dto/service-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly contextService: ContextService,
  ) {}

  private issueAccessToken(oauth: OAuth) {
    return this.jwtService.sign(
      {
        id: oauth.id,
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

  public verifyAccessToken(accessToken: string, error: JsonWebTokenError | TokenExpiredError | null = null): JwtVerifyResult<JwtAccessPayload> {
    const verifyResult: JwtVerifyResult<JwtAccessPayload> = {
      payload: null,
      error,
    };

    try {
      verifyResult.payload = this.jwtService.verify<JwtAccessPayload>(accessToken, {
        secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
        ignoreExpiration: error instanceof TokenExpiredError,
      });
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        return this.verifyAccessToken(accessToken, e);
      }

      verifyResult.error = e;
    }

    return verifyResult;
  }

  public verifyRefreshToken(accessToken: string, refreshToken: string): boolean {
    try {
      const payload = this.jwtService.verify<JwtRefreshPayload>(refreshToken, {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
      });

      return payload.signature === accessToken.split('.').pop();
    } catch {
      return false;
    }
  }

  async getOAuth(id: string) {
    const oauthRepository = this.dataSource.getRepository(OAuth);
    const oauth = await oauthRepository.findOne({
      relations: { user: true },
      where: { id },
    });

    return oauth;
  }

  async getPlayer(oauth: OAuth) {
    const playerRepository = this.dataSource.getRepository(Player);
    const player = await playerRepository.findOne({
      relations: { game: true },
      where: { userId: oauth.userId, status: PlayerStatus.Activated },
    });

    return player;
  }

  async issueToken(id: string) {
    const oauth = await this.getOAuth(id);

    if (!oauth) {
      throw new UnauthorizedException();
    }

    const accessToken = this.issueAccessToken(oauth);
    const refreshToken = this.issueRefreshToken(accessToken);

    return new ServiceTokenDTO(accessToken, refreshToken);
  }

  async reIssueToken(oauth: OAuth) {
    const accessToken = this.issueAccessToken(oauth);
    const refreshToken = this.issueRefreshToken(accessToken);

    return new ServiceTokenDTO(accessToken, refreshToken);
  }

  async getAuth() {
    const oauth = this.contextService.requestUser;
    const player = this.contextService.requestPlayer;

    return new AuthDTO(oauth, player);
  }
}
