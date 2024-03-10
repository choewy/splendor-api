import { JWT_CLIENT_CONFIG, JwtConfigReturnType } from '@libs/configs';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { ClientJwtService } from './client-jwt-service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.get<JwtConfigReturnType>(JWT_CLIENT_CONFIG).access;
      },
    }),
  ],
  providers: [ClientJwtService],
  exports: [ClientJwtService],
})
export class ClientJwtModule {}
