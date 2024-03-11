import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export type JwtConfigReturnType = {
  access: JwtModuleOptions;
  refresh: JwtModuleOptions;
};

export const JWT_CONFIG = '__jwt_config__';

export const JwtConfig = registerAs(
  JWT_CONFIG,
  (): JwtConfigReturnType => ({
    access: {
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: {
        subject: process.env.JWT_ACCESS_SUBJECT,
        audience: process.env.JWT_ACCESS_AUDIENCE,
        expiresIn: '1h',
      },
      verifyOptions: {
        subject: process.env.JWT_ACCESS_SUBJECT,
        audience: process.env.JWT_ACCESS_AUDIENCE,
      },
    },
    refresh: {
      secret: process.env.JWT_REFRESH_SECRET,
      signOptions: {
        subject: process.env.JWT_REFRESH_SUBJECT,
        audience: process.env.JWT_REFRESH_AUDIENCE,
        expiresIn: '1h',
      },
      verifyOptions: {
        subject: process.env.JWT_REFRESH_SUBJECT,
        audience: process.env.JWT_REFRESH_AUDIENCE,
      },
    },
  }),
);
