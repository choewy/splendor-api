import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

import { WidgetSession } from '../sessions';

@Injectable()
export class WidgetSessionManager {
  constructor(private readonly redis: Redis) {}

  protected createKey(studioId: number) {
    return ['studio', studioId, 'widgets'].join(':');
  }

  async get(studioId: number, socketId: string) {
    return WidgetSession.toInstance(await this.redis.hget(this.createKey(studioId), socketId));
  }

  async getAll(studioId: number) {
    const sessions: WidgetSession[] = [];
    const socketIds = await this.redis.hkeys(this.createKey(studioId));

    for (const socketId of socketIds) {
      const session = await this.get(studioId, socketId);

      if (session) {
        sessions.push(session);
      }
    }

    return sessions;
  }

  async getCount(studioId: number) {
    return (await this.getSocketIds(studioId)).length;
  }

  async getSocketIds(studioId: number) {
    return this.redis.hkeys(this.createKey(studioId));
  }

  async set(studioId: number, socketId: string, session: WidgetSession) {
    await this.redis.hset(this.createKey(studioId), session.toHash(socketId));
    return session;
  }

  async delete(studioId: number, socketId: string) {
    const session = await this.get(studioId, socketId);

    if (session) {
      await this.redis.hdel(this.createKey(studioId), socketId);
    }

    return session;
  }

  async deleteMany(studioId: number, ...socketIds: string[]) {
    await this.redis.hdel(this.createKey(studioId), ...socketIds);
  }
}
