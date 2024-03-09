import { OAuthRepository } from '@libs/entity';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OAuthController } from './oauth.controller';
import { OAuthService } from './services';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([OAuthRepository])],
  controllers: [OAuthController],
  providers: [OAuthService],
})
export class OAuthModule {}
