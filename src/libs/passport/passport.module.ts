import { ConfigExModule, JwtConfigService } from '@libs/config';
import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { PassportJwtGuard } from './guards';
import { PassportJwtStrategy } from './strategies';

@Module({})
export class PassportExModule {
  static forRoot(): DynamicModule {
    return {
      imports: [
        ConfigExModule.forFeature([JwtConfigService], { global: true }),
        PassportModule,
        JwtModule.registerAsync({
          inject: [JwtConfigService],
          useFactory(jwtConfigService: JwtConfigService) {
            return jwtConfigService.getJwtModuleOptions();
          },
        }),
      ],
      module: PassportExModule,
      providers: [JwtService, PassportJwtStrategy, PassportJwtGuard],
      exports: [JwtService, PassportJwtStrategy, PassportJwtGuard],
      global: true,
    };
  }
}
