import { DonationEntity, StudioPlaySettingEntity, UserEntity } from '@libs/entity';
import { Injectable, Type } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Redis } from 'ioredis';
import { v4 } from 'uuid';

import { DonationStatus } from './constants';
import { SocketSession, WidgetSession, PlaySettingSession, DonationSession } from './implements';

@Injectable()
export class SessionService {
  readonly serverId = v4();

  constructor(private readonly redis: Redis) {}

  stringify<Session>(session: Session) {
    return JSON.stringify(session, null, 2);
  }

  async parse<Session>(session: Type<Session>, value: Promise<string | null>) {
    const result = await value;

    if (result === null) {
      return null;
    }

    try {
      return plainToInstance(session, JSON.parse(result), {
        enableCircularCheck: true,
        enableImplicitConversion: true,
      });
    } catch {
      return null;
    }
  }

  async getPlaySettingSession(studioId: number) {
    return this.parse(PlaySettingSession, this.redis.get(PlaySettingSession.createKey(studioId)));
  }

  async createPlaySettingSession(studioPlaySetting: Partial<StudioPlaySettingEntity>) {
    const studioId = studioPlaySetting.studioId;

    let session = await this.getPlaySettingSession(studioId);

    if (session === null) {
      session = new PlaySettingSession(studioPlaySetting);
      await this.redis.set(PlaySettingSession.createKey(studioId), this.stringify(session));
    }

    return session;
  }

  async updatePlaySettingSession(studioPlaySetting: Partial<StudioPlaySettingEntity>) {
    const studioId = studioPlaySetting.studioId;
    const playSettingSessionKey = PlaySettingSession.createKey(studioId);
    const playSettingSession = new PlaySettingSession(studioPlaySetting);

    if (await this.redis.exists(playSettingSessionKey)) {
      await this.redis.set(playSettingSessionKey, this.stringify(playSettingSession));
      return playSettingSession;
    }

    return null;
  }

  async deletePlaySettingSession(studioId: number) {
    await this.redis.del(PlaySettingSession.createKey(studioId));
  }

  async getSocketSession(socketId: string) {
    const key = SocketSession.createKey();
    return this.parse(SocketSession, this.redis.hget(key, socketId));
  }

  async createSocketSession(studioId: number, socketId: string) {
    const socketSessionKey = SocketSession.createKey();
    const socketSession = new SocketSession(this.serverId, studioId);

    await this.redis.hset(socketSessionKey, { [socketId]: this.stringify(socketSession) });
  }

  async deleteSocketSession(socketId: string) {
    const socketSessionKey = SocketSession.createKey();
    const socketSession = await this.getSocketSession(socketId);

    if (socketSession?.serverId === this.serverId) {
      await this.redis.hdel(socketSessionKey, socketId);
    }

    return socketSession;
  }

  async getWidgetSession(studioId: number, socketId: string) {
    return this.parse(WidgetSession, this.redis.hget(WidgetSession.createKey(studioId), socketId));
  }

  async getWidgetSessionCount(studioId: number) {
    return this.redis.hlen(WidgetSession.createKey(studioId));
  }

  async createWidgetSession(studioId: number, socketId: string, name: string) {
    const socketSessionKey = SocketSession.createKey();
    const socketSession = new SocketSession(this.serverId, studioId);
    await this.redis.hset(socketSessionKey, { [socketId]: this.stringify(socketSession) });

    const widgetSessionKey = WidgetSession.createKey(studioId);
    const widgetSession = new WidgetSession(name);
    await this.redis.hset(widgetSessionKey, { [socketId]: this.stringify(widgetSession) });
  }

  async updateWidgetSession(studioId: number, socketId: string, session: WidgetSession) {
    await this.redis.hset(WidgetSession.createKey(studioId), { [socketId]: this.stringify(session) });
  }

  async deleteWidgetSession(socketId: string): Promise<void> {
    const socketSession = await this.deleteSocketSession(socketId);

    if (socketSession === null) {
      return;
    }

    const serverId = socketSession.serverId;
    const studioId = socketSession.studioId;

    if (serverId !== this.serverId) {
      return;
    }

    const widgetSession = await this.getWidgetSession(studioId, socketId);

    if (widgetSession) {
      await this.redis.hdel(WidgetSession.createKey(studioId), socketId);
    }

    const count = await this.getWidgetSessionCount(studioId);

    if (count > 0) {
      return;
    }

    await this.deletePlaySettingSession(studioId);
  }

  async getDonationIndex(studioId: number, id: number) {
    return this.redis.hget(DonationSession.createHashKey(studioId), String(id));
  }

  async getDonationSession(studioId: number, id: number) {
    const index = await this.getDonationIndex(studioId, id);

    if (index === null) {
      return null;
    }

    return this.parse(DonationSession, this.redis.lindex(DonationSession.createListKey(studioId), index));
  }

  async createDonationSession(studioId: number, donation: Partial<DonationEntity>, sender: Partial<UserEntity>, status?: DonationStatus) {
    const listKey = DonationSession.createListKey(studioId);
    const hashKey = DonationSession.createHashKey(studioId);

    const session = new DonationSession(donation, sender, status);
    const index = await this.redis.rpush(listKey, this.stringify(session));

    await this.redis.hset(hashKey, { [session.id]: index - 1 });
    await this.redis.expire(listKey, DonationSession.TTL);
    await this.redis.expire(hashKey, DonationSession.TTL);

    return session;
  }

  async updateDonationSession(studioId: number, donation: DonationSession) {
    const index = await this.getDonationIndex(studioId, donation.id);

    if (index === null) {
      return null;
    }

    await this.redis.lset(DonationSession.createListKey(studioId), index, this.stringify(donation));
  }
}
