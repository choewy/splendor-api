import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { OAuth } from 'src/domain/entities/oauth.entity';
import { User } from 'src/domain/entities/user.entity';
import { OAuthPlatform } from 'src/domain/enums';
import { DataSource } from 'typeorm';

@Injectable()
export class OAuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  private get clientUrl() {
    return this.configService.getOrThrow('CLIENT_URL');
  }

  async signWithOAuth(response: Response, platform: OAuthPlatform, oauthId: string | number, nickname?: string, email?: string, imageUrl?: string) {
    let oauth = await this.get(platform, oauthId);

    if (oauth) {
      oauth = await this.update(oauth, nickname, email, imageUrl);
    } else {
      oauth = await this.insert(platform, oauthId, nickname, email, imageUrl);
    }

    response.redirect(`${this.clientUrl}/oauth/${oauth.id}`);
  }

  private async get(platform: OAuthPlatform, oauthId: string | number) {
    const oauthRepository = this.dataSource.getRepository(OAuth);
    const oauth = await oauthRepository.findOne({
      relations: { user: true },
      where: { platform, oauthId: String(oauthId) },
    });

    return oauth;
  }

  private async insert(platform: OAuthPlatform, oauthId: string | number, nickname?: string, email?: string, imageUrl?: string) {
    return this.dataSource.transaction(async (em) => {
      const userRepository = em.getRepository(User);
      const user = userRepository.create({});
      await userRepository.insert(user);

      const oauthRepository = em.getRepository(OAuth);
      const oauth = oauthRepository.create({ platform, oauthId: String(oauthId), nickname, email, imageUrl, user });
      await oauthRepository.insert(oauth);

      return oauth;
    });
  }

  private async update(oauth: OAuth, nickname?: string, email?: string, imageUrl?: string) {
    await this.dataSource.getRepository(OAuth).update(oauth.id, { nickname, email, imageUrl });

    return oauth;
  }
}
