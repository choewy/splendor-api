import { FollowRepository, UserRepository } from '@libs/entity';
import { TypeOrmLibsModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';

import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';

@Module({
  imports: [TypeOrmLibsModule.forFeature([UserRepository, FollowRepository])],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}
