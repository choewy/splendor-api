import { UserRepository } from '@libs/entity';
import { TypeOrmLibsModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientJwtModule } from '../jwt/client-jwt.module';

@Module({
  imports: [ClientJwtModule, TypeOrmLibsModule.forFeature([UserRepository])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
