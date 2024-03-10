import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule, JwtModuleAsyncOptions } from '@nestjs/jwt';

import { ClientJwtService } from './client-jwt-service';
import { ClientJwtGuard } from './client-jwt.guard';
import { ClientJwtStrategy } from './client-jwt.strategy';

@Module({})
export class ClientJwtModule {
  static forRoot(options: JwtModuleAsyncOptions): DynamicModule {
    return {
      global: true,
      imports: [JwtModule.registerAsync({ global: true, ...options })],
      providers: [ClientJwtService, ClientJwtStrategy, ClientJwtGuard],
      exports: [ClientJwtService, ClientJwtStrategy, ClientJwtGuard],
      module: ClientJwtModule,
    };
  }
}
