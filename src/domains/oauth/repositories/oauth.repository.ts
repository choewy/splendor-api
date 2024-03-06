import { OAuthEntity, OAuthPlatform } from '@entities/oauth.entity';
import { UserEntity } from '@entities/user.entity';
import { AbstractRepository, InjectableRepository } from '@libs/typeorm';
import { DeepPartial } from 'typeorm';

@InjectableRepository(OAuthEntity)
export class OAuthRepository extends AbstractRepository<OAuthEntity> {
  async findByOAuthId(platform: OAuthPlatform, oauthId: number | string) {
    return this.findOne({
      relations: { user: true },
      where: { oauthId: String(oauthId), platform },
    });
  }

  async createOAuthWithUser(deepPartial: DeepPartial<OAuthEntity>): Promise<OAuthEntity> {
    return this.transaction(async (em) => {
      const userRepository = em.getRepository(UserEntity);
      const user = userRepository.create({
        nickname: deepPartial.nickname,
        profileImageUrl: deepPartial.profileImageUrl,
        studio: {
          studioSetting: {},
          alertWidget: {},
          messageWidget: {},
        },
      });
      await user.save();

      const oauthRepository = em.getRepository(OAuthEntity);
      const oauth = oauthRepository.create({ ...deepPartial, user });
      await oauthRepository.insert(oauth);

      return oauth;
    });
  }

  async createOAuthIntoUser(userId: number, deepPartial: DeepPartial<OAuthEntity>): Promise<OAuthEntity> {
    const oauth = this.create({ ...deepPartial, user: { id: userId } });
    await this.insert(oauth);

    return oauth;
  }

  async updateOAuth(oauth: OAuthEntity, deepPartial: DeepPartial<Pick<OAuthEntity, 'email' | 'nickname' | 'profileImageUrl'>>) {
    oauth.email = deepPartial.email;
    oauth.nickname = deepPartial.nickname;
    oauth.profileImageUrl = deepPartial.profileImageUrl;

    await this.update(oauth.id, deepPartial);

    return oauth;
  }
}
