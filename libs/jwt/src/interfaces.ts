import { ModuleMetadata, Provider, Type } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

export interface JwtLibsModuleOptions {
  access: JwtModuleOptions;
  refresh: JwtModuleOptions;
}

export interface JwtLibsModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  global?: boolean;
  useExisting?: Type<JwtOptionsFactory>;
  useClass?: Type<JwtOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<JwtLibsModuleOptions> | JwtLibsModuleOptions;
  inject?: any[];
  extraProviders?: Provider[];
}
