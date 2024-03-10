import { registerAs } from '@nestjs/config';
import { JwtModuleOptions, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';

export type JwtConfigReturnType = {
  moduleOptions: JwtModuleOptions;
  access: { secret: string; signOptions: JwtSignOptions; verifyOptions: JwtVerifyOptions };
  refresh: { secret: string; signOptions: JwtSignOptions; verifyOptions: JwtVerifyOptions };
};

export const JWT_ADMIN_CONFIG = '__jwt_admin_config__';
export const JWT_CLIENT_CONFIG = '__jwt_client_config__';

export const JwtAdminConfig = registerAs(JWT_ADMIN_CONFIG, (): JwtConfigReturnType => {
  const accessSecret = process.env.JWT_ADMIN_ACCESS_SECRET;
  const accessSignOptions: JwtSignOptions = { subject: 'access', audience: 'admin', expiresIn: '1h' };
  const accessVerifyOptions: JwtVerifyOptions = { subject: 'access', audience: 'admin' };

  const refreshSecret = process.env.JWT_ADMIN_REFRESH_SECRET;
  const refreshSignOptions: JwtSignOptions = { subject: 'refresh', audience: 'admin', expiresIn: '14d' };
  const refreshVerifyOptions: JwtVerifyOptions = { subject: 'refresh', audience: 'admin' };

  return {
    moduleOptions: { secret: accessSecret, signOptions: accessSignOptions, verifyOptions: accessVerifyOptions },
    access: {
      secret: accessSecret,
      signOptions: { ...accessSignOptions, secret: accessSecret },
      verifyOptions: { ...accessVerifyOptions, secret: accessSecret },
    },
    refresh: {
      secret: refreshSecret,
      signOptions: { ...refreshSignOptions, secret: refreshSecret },
      verifyOptions: { ...refreshVerifyOptions, secret: refreshSecret },
    },
  };
});

export const JwtClientConfig = registerAs(JWT_CLIENT_CONFIG, (): JwtConfigReturnType => {
  const accessSecret = process.env.JWT_CLIENT_ACCESS_SECRET;
  const accessSignOptions: JwtSignOptions = { subject: 'access', audience: 'client', expiresIn: '1h' };
  const accessVerifyOptions: JwtVerifyOptions = { subject: 'access', audience: 'client' };

  const refreshSecret = process.env.JWT_CLIENT_REFRESH_SECRET;
  const refreshSignOptions: JwtSignOptions = { subject: 'refresh', audience: 'client', expiresIn: '14d' };
  const refreshVerifyOptions: JwtVerifyOptions = { subject: 'refresh', audience: 'client' };

  return {
    moduleOptions: { secret: accessSecret, signOptions: accessSignOptions, verifyOptions: accessVerifyOptions },
    access: {
      secret: accessSecret,
      signOptions: { ...accessSignOptions, secret: accessSecret },
      verifyOptions: { ...accessVerifyOptions, secret: accessSecret },
    },
    refresh: {
      secret: refreshSecret,
      signOptions: { ...refreshSignOptions, secret: refreshSecret },
      verifyOptions: { ...refreshVerifyOptions, secret: refreshSecret },
    },
  };
});
