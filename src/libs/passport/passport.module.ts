import { ConfigExModule, JwtConfigService } from '@libs/config';
import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { PassportJwtGuard } from './guards';
import { PassportJwtStrategy } from './strategies';

@Module({})
export class PassportExModule {
  static forRoot(): DynamicModule {
    return {
      imports: [
        ConfigExModule.forFeature([JwtConfigService]),
        PassportModule,
        JwtModule.registerAsync({
          imports: [ConfigExModule.forFeature([JwtConfigService])],
          inject: [JwtConfigService],
          useFactory(jwtConfigService: JwtConfigService) {
            return jwtConfigService.getJwtModuleOptions();
          },
        }),
      ],
      module: PassportExModule,
      providers: [PassportJwtStrategy, PassportJwtGuard],
      exports: [PassportJwtStrategy, PassportJwtGuard],
    };
  }
}
