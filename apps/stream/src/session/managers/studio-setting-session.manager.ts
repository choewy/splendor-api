import { StudioPlaySettingEntity } from '@libs/entity';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

import { StudioSettingSession } from '../sessions';

@Injectable()
export class StudioSettingSessionManager {
  constructor(private readonly redis: Redis) {}

  protected createKey(studioId: number) {
    return ['studio', studioId, 'setting'].join(':');
  }

  async get(studioId: number) {
    return StudioSettingSession.toInstance(await this.redis.get(this.createKey(studioId)));
  }

  async set(studioId: number, session: StudioSettingSession) {
    await this.redis.set(this.createKey(studioId), session.stringify());
    return session;
  }

  async create(studioId: number, studioPlaySetting: Partial<StudioPlaySettingEntity>) {
    let session = await this.get(studioId);

    if (session === null) {
      session = await this.set(studioId, new StudioSettingSession(studioPlaySetting));
    }

    return session;
  }

  async delete(studioId: number) {
    const session = await this.get(studioId);

    if (session) {
      await this.redis.del(this.createKey(studioId));
    }

    return session;
  }
}
