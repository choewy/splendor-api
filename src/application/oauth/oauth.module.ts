import { forwardRef, Module } from '@nestjs/common';

import { OAuthService } from './oauth.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [OAuthService],
  exports: [OAuthService],
})
export class OAuthModule {}
