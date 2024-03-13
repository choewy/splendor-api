import { registerAs } from '@nestjs/config';

export type EnsembleConfigReturnType = {
  servers: {
    client: string;
    stream: string;
    admin: string;
  };
};

export const ENSEMBLE_CONFIG = '__ensemble_config__';

export const EnsembleConfig = registerAs(
  ENSEMBLE_CONFIG,
  (): EnsembleConfigReturnType => ({
    servers: {
      client: process.env.ENSEMBLE_CLIENT_SERVER_URL,
      stream: process.env.ENSEMBLE_STREAM_SERVER_URL,
      admin: process.env.ENSEMBLE_ADMIN_SERVER_URL,
    },
  }),
);
