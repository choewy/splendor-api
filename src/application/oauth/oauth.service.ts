import { Injectable } from '@nestjs/common';
import { OAuth } from 'src/domain/entities/oauth.entity';
import { User } from 'src/domain/entities/user.entity';
import { OAuthPlatform } from 'src/domain/enums';
import { DataSource } from 'typeorm';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class OAuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly authService: AuthService,
  ) {}

  async signWithOAuth(platform: OAuthPlatform, oauthId: string | number, nickname?: string, email?: string, imageUrl?: string) {
    const oauthRepository = this.dataSource.getRepository(OAuth);

    let oauth = await oauthRepository.findOneBy({ platform, oauthId: String(oauthId) });

    if (oauth) {
      await oauthRepository.update(oauth.id, { nickname, email, imageUrl });
    } else {
      oauth = await this.dataSource.transaction(async (em) => {
        const userRepository = em.getRepository(User);
        const user = userRepository.create({});
        await userRepository.insert(user);

        const oauthRepository = em.getRepository(OAuth);
        const oauth = oauthRepository.create({ platform, oauthId: String(oauthId), nickname, email, imageUrl, user });
        await oauthRepository.insert(oauth);

        return oauth;
      });
    }

    return this.authService.issueToken(oauth.id);
  }
}
