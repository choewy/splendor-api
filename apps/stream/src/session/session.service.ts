import { StudioPlaySettingEntity } from '@libs/entity';
import { Injectable, Type } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Redis } from 'ioredis';
import { v4 } from 'uuid';

import { AlertWidgetGatewaySession, StudioWidgetSession, StudioPlaySession, StudioSettingSession } from './implements';

@Injectable()
export class SessionService {
  readonly serverId = v4();

  constructor(private readonly redis: Redis) {}

  stringify<Session>(session: Session) {
    return JSON.stringify(session, null, 2);
  }

  async parseHash<Session>(session: Type<Session>, record: Promise<Record<string, string> | null>) {
    const result = await record;

    if (result === null) {
      return null;
    }

    try {
      return plainToInstance(session, result);
    } catch {
      return null;
    }
  }

  async parseStr<Session>(session: Type<Session>, value: Promise<string | null>) {
    const result = await value;

    if (result === null) {
      return null;
    }

    try {
      return plainToInstance(session, JSON.parse(result));
    } catch {
      return null;
    }
  }

  async createStudioPlaySession(studioId: number): Promise<void> {
    const key = StudioPlaySession.createKey(studioId);

    if (await this.redis.exists(key)) {
      return;
    }

    await this.redis.hset(key, new StudioPlaySession());
  }

  async deleteStudioPlaySession(studioId: number) {
    await this.redis.del(StudioPlaySession.createKey(studioId));
  }

  async createStudioSettingSession(studioPlaySetting: StudioPlaySettingEntity) {
    const studioId = studioPlaySetting.studioId;
    const key = StudioSettingSession.createKey(studioId);

    if (await this.redis.exists(key)) {
      return;
    }

    await this.redis.hset(key, new StudioSettingSession(studioPlaySetting));
  }

  async deleteStudioSettingSession(studioId: number) {
    await this.redis.del(StudioSettingSession.createKey(studioId));
  }

  async getAlertWidgetGatewaySession(socketId: string) {
    const key = AlertWidgetGatewaySession.createKey();
    return this.parseStr(AlertWidgetGatewaySession, this.redis.hget(key, socketId));
  }

  async createAlertWidgetGatewaySession(studioId: number, socketId: string) {
    const alertWidgetGatewaySessionKey = AlertWidgetGatewaySession.createKey();
    const alertWidgetGatewaySession = new AlertWidgetGatewaySession(this.serverId, studioId);

    await this.redis.hset(alertWidgetGatewaySessionKey, { [socketId]: this.stringify(alertWidgetGatewaySession) });
  }

  async deleteAlertWidgetGatewaySession(socketId: string): Promise<AlertWidgetGatewaySession | null> {
    const key = AlertWidgetGatewaySession.createKey();
    const session = await this.getAlertWidgetGatewaySession(socketId);

    if (session?.serverId === this.serverId) {
      await this.redis.hdel(key, socketId);
      return session;
    }

    return null;
  }

  async getStudioWidgetSession(studioId: number, socketId: string) {
    const key = StudioWidgetSession.createKey(studioId);
    return this.parseStr(StudioWidgetSession, this.redis.hget(key, socketId));
  }

  async getStudioWidgetSessionCount(studioId: number) {
    const key = StudioWidgetSession.createKey(studioId);
    return this.redis.hlen(key);
  }

  async createStudioWidgetSession(studioId: number, socketId: string, name: string) {
    const key = StudioWidgetSession.createKey(studioId);
    const session = new StudioWidgetSession(name);

    await this.redis.hset(key, { [socketId]: this.stringify(session) });
  }

  async deleteStudioWidgetSession(studioId: number, socketId: string): Promise<void> {
    const key = StudioWidgetSession.createKey(studioId);
    const session = await this.getStudioWidgetSession(studioId, socketId);

    if (session) {
      await this.redis.hdel(key, socketId);
    }

    const count = await this.getStudioWidgetSessionCount(studioId);

    if (count > 0) {
      return;
    }

    await this.deleteStudioPlaySession(studioId);
    await this.deleteStudioSettingSession(studioId);
  }
}
