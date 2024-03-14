import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

import { StudioPlaySession } from '../sessions';

@Injectable()
export class StudioPlaySessionManager {
  constructor(private readonly redis: Redis) {}

  protected createKey(studioId: number) {
    return ['studio', studioId, 'play'].join(':');
  }

  async get(studioId: number) {
    return StudioPlaySession.toInstance(await this.redis.get(this.createKey(studioId)));
  }

  async set(studioId: number, session: StudioPlaySession) {
    await this.redis.set(this.createKey(studioId), session.stringify());
    return session;
  }

  async create(studioId: number) {
    let session = await this.get(studioId);

    if (session === null) {
      session = await this.set(studioId, new StudioPlaySession());
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
