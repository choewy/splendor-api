import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

import { DonationSession } from '../sessions';

@Injectable()
export class DonationSessionManager {
  constructor(private readonly redis: Redis) {}

  protected createKey(studioId: number) {
    return ['studio', studioId, 'donations'].join(':');
  }

  protected createHashKey(studioId: number) {
    return ['studio', studioId, 'donationshash'].join(':');
  }

  async setExpire(studioId: number) {
    const ttl = 60 * 60 * 24;

    await this.redis.expire(this.createKey(studioId), ttl);
    await this.redis.expire(this.createHashKey(studioId), ttl);
  }

  async getIndex(studioId: number, donationId: number) {
    return DonationSession.toIndex(await this.redis.hget(this.createHashKey(studioId), String(donationId)));
  }

  async getByIndex(studioId: number, index: number) {
    return DonationSession.toInstance(await this.redis.lindex(this.createKey(studioId), index));
  }

  async getByDonationId(studioId: number, donationId: number) {
    const index = await this.getIndex(studioId, donationId);

    if (index === null) {
      return null;
    }

    return this.getByIndex(studioId, index);
  }

  async push(studioId: number, session: DonationSession) {
    const index = await this.redis.rpush(this.createKey(studioId), session.stringify());
    await this.redis.hset(this.createHashKey(studioId), session.toHash(index));
    await this.setExpire(studioId);

    return session;
  }

  async lset(studioId: number, index: number, session: DonationSession) {
    await this.redis.lset(this.createKey(studioId), index, session.stringify());
    await this.setExpire(studioId);

    return session;
  }

  async set(studioId: number, session: DonationSession) {
    const index = await this.getIndex(studioId, session.id);

    if (index === null) {
      await this.push(studioId, session);
    } else {
      await this.lset(studioId, index, session);
    }

    return session;
  }

  async delete(studioId: number) {
    await this.redis.del(this.createKey(studioId), this.createHashKey(studioId));
  }
}
