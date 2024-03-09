import { UserRepository, OAuthRepository } from '@libs/entity';
import { TypeOrmLibsModule } from '@libs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { OAuthController } from './oauth.controller';
import { OAuthService } from './services';
import { AuthModule } from '../auth';

@Module({
  imports: [AuthModule, HttpModule, TypeOrmLibsModule.forFeature([UserRepository, OAuthRepository])],
  controllers: [OAuthController],
  providers: [JwtService, OAuthService],
})
export class OAuthModule {}
