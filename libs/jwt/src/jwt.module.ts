import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtLibsModuleAsyncOptions } from './interfaces';
import { JwtGuard } from './jwt.guard';
import { JwtLibsService } from './jwt.service';
import { JwtStrategy } from './jwt.strategy';

@Module({})
export class JwtLibsModule {
  static forRootAsync(moduleAsyncOptions: JwtLibsModuleAsyncOptions): DynamicModule {
    const jwtModule = JwtModule.registerAsync({
      global: true,
      inject: moduleAsyncOptions.inject,
      async useFactory(...dependencies) {
        const moduleOptions = await moduleAsyncOptions.useFactory(...dependencies);
        return moduleOptions.access;
      },
    });

    const jwtStrategy = JwtStrategy.createProvider(moduleAsyncOptions);
    const jwtLibService = JwtLibsService.createProvider(moduleAsyncOptions);

    return {
      global: true,
      imports: [jwtModule],
      providers: [jwtLibService, jwtStrategy, JwtGuard],
      exports: [jwtLibService, jwtStrategy, JwtGuard],
      module: JwtLibsModule,
    };
  }
}
