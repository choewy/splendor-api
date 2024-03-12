import { BlockRepository, DonationRepository, ForbiddenWordRepository, StudioRepository, UserRepository } from '@libs/entity';
import { TypeOrmLibsModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';

import { DonationController } from './donation.controller';
import { DonationService } from './donation.service';

@Module({
  imports: [TypeOrmLibsModule.forFeature([UserRepository, StudioRepository, BlockRepository, ForbiddenWordRepository, DonationRepository])],
  controllers: [DonationController],
  providers: [DonationService],
})
export class DonationModule {}
