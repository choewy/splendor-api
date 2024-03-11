import { ModuleMetadata, Provider, Type } from '@nestjs/common';
import { JwtOptionsFactory } from '@nestjs/jwt';
import { RedisOptions } from 'ioredis';

export interface RedisLibsModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  global?: boolean;
  useExisting?: Type<JwtOptionsFactory>;
  useClass?: Type<JwtOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<RedisOptions> | RedisOptions;
  inject?: any[];
  extraProviders?: Provider[];
}
