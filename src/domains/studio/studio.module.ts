import { TypeOrmExModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';

import { StudioService } from './services';
import { StudioController } from './studio.controller';
import { StudioRepository } from './studio.repository';

@Module({
  imports: [TypeOrmExModule.forFeature([StudioRepository])],
  controllers: [StudioController],
  providers: [StudioService],
})
export class StudioModule {}
