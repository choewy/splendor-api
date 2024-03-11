import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { registerAs } from '@nestjs/config';

export type AppConfigReturnType = {
  version: string;
  port: number;
  corsOptions: CorsOptions;
  swaggerUserId: number;
};

export const APP_CONFIG = '__app_config__';

export const AppConfig = registerAs(
  APP_CONFIG,
  (): AppConfigReturnType => ({
    version: process.env.VERSION,
    port: +process.env.PORT,
    corsOptions: { origin: process.env.ORIGIN ? new RegExp(process.env.ORIGIN) : undefined },
    swaggerUserId: +process.env.SWAGGER_USER_ID,
  }),
);
