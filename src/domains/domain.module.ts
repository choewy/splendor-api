import { Module } from '@nestjs/common';

import { AuthModule } from './auth';
import { FollowModule } from './follow';
import { OAuthModule } from './oauth';
import { StudioModule } from './studio';
import { UserModule } from './user';

@Module({
  imports: [OAuthModule, AuthModule, UserModule, StudioModule, FollowModule],
})
export class DomainModule {}
