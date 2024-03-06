import { TypeOrmExModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';

import { FollowController } from './follow.controller';
import { FollowRepository, FollowUserRepository } from './repositories';
import { FollowService } from './services';

@Module({
  imports: [TypeOrmExModule.forFeature([FollowRepository, FollowUserRepository])],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}
