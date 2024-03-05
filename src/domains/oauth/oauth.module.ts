import { ConfigExModule, KakaoOAuthConfigService, NaverOAuthConfigService, OAuthConfigService } from '@libs/config';
import { TypeOrmExModule } from '@libs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { OAuthController } from './oauth.controller';
import { OAuthRepository } from './oauth.repository';
import { OAuthService, GoogleOAuthService, KakaoOAuthService, NaverOAuthService } from './services';

@Module({
  imports: [
    TypeOrmExModule.forFeature([OAuthRepository]),
    ConfigExModule.forFeature([OAuthConfigService, KakaoOAuthConfigService, NaverOAuthConfigService]),
    HttpModule,
  ],
  controllers: [OAuthController],
  providers: [OAuthService, GoogleOAuthService, KakaoOAuthService, NaverOAuthService],
})
export class OAuthModule {}
