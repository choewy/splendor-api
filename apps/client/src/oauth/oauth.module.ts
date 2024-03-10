import { UserRepository, OAuthRepository } from '@libs/entity';
import { TypeOrmLibsModule } from '@libs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';
import { ClientJwtModule } from '../jwt';

@Module({
  imports: [ClientJwtModule, HttpModule, TypeOrmLibsModule.forFeature([UserRepository, OAuthRepository])],
  controllers: [OAuthController],
  providers: [OAuthService],
})
export class OAuthModule {}
