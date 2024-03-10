import { registerAs } from '@nestjs/config';

export enum NodeEnv {
  Local = 'local',
  Development = 'development',
  Production = 'production',
}

export type SystemConfigReturnType = {
  tz: string;
  env: NodeEnv;
};

export const SYSTEM_CONFIG = '__system_config__';

export const SystemConfig = registerAs(
  SYSTEM_CONFIG,
  (): SystemConfigReturnType => ({
    tz: process.env.TZ,
    env: process.env.NODE_ENV as NodeEnv,
  }),
);
