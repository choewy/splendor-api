import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { PlayerAuthGuard } from './guard/player-auth.guard';

@Module({
  imports: [JwtModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, PlayerAuthGuard],
  exports: [AuthService, JwtAuthGuard, PlayerAuthGuard],
})
export class AuthModule {}
