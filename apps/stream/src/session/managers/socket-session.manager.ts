import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { v4 } from 'uuid';

import { SocketSession } from '../sessions';

@Injectable()
export class SocketSessionManager {
  constructor(private readonly redis: Redis) {}

  protected readonly managerId = v4();

  protected createKey() {
    return ['sockets', this.managerId].join(':');
  }

  async get(socketId: string) {
    return SocketSession.toInstance(await this.redis.hget(this.createKey(), socketId));
  }

  async getSocketIds() {
    return this.redis.hkeys(this.createKey());
  }

  async set(socketId: string, session: SocketSession) {
    await this.redis.hset(this.createKey(), { [socketId]: session.stringify() });
    return session;
  }

  async create(socketId: string, studioId: number) {
    let session = await this.get(socketId);

    if (session === null) {
      session = await this.set(socketId, new SocketSession(studioId));
    }

    return session;
  }

  async delete(socketId: string) {
    const session = await this.get(socketId);

    if (session) {
      await this.redis.hdel(this.createKey(), socketId);
    }

    return session;
  }
}
