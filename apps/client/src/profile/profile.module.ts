import { UserRepository } from '@libs/entity';
import { TypeOrmLibsModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';

import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [TypeOrmLibsModule.forFeature([UserRepository])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
