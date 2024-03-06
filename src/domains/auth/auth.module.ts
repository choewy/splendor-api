import { TypeOrmExModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';

import { AuthUserRepository } from './auth-user.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmExModule.forFeature([AuthUserRepository])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
