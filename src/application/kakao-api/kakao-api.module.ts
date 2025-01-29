import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';

import { KakaoApiController } from './kakao-api.controller';
import { KakaoApiService } from './kakao-api.service';
import { OAuthModule } from '../oauth/oauth.module';

@Module({
  imports: [HttpModule, forwardRef(() => OAuthModule)],
  controllers: [KakaoApiController],
  providers: [KakaoApiService],
  exports: [KakaoApiService],
})
export class KakaoApiModule {}
