import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const TYPEORM_MYSQL_CONFIG = '__typeorm_mysql__';

export const TypeOrmMySQLConfig = registerAs(
  TYPEORM_MYSQL_CONFIG,
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: +process.env.MYSQL_PORT,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    synchronize: process.env.NODE_ENV === 'local' ? process.env.MYSQL_SYNCHRONIZE === 'true' : false,
    logging: ['error', 'warn'],
    autoLoadEntities: true,
  }),
);
