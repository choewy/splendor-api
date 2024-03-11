import { registerAs } from '@nestjs/config';
import { RedisOptions } from 'ioredis';

export const REDIS_CONFIG = '__redis_config__';

export const RedisConfig = registerAs(
  REDIS_CONFIG,
  (): RedisOptions => ({
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    db: +process.env.REDIS_DB,
  }),
);
