import { JWT_CLIENT_CONFIG, JwtConfigReturnType } from '@libs/configs';
import { UserRepository } from '@libs/entity';
import { TypeOrmLibsModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmLibsModule.forFeature([UserRepository]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.get<JwtConfigReturnType>(JWT_CLIENT_CONFIG).access;
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
