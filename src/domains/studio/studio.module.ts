import { TypeOrmExModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';

import { StudioRepository } from './repositories';
import { StudioService } from './services';
import { StudioController } from './studio.controller';

@Module({
  imports: [TypeOrmExModule.forFeature([StudioRepository])],
  controllers: [StudioController],
  providers: [StudioService],
})
export class StudioModule {}
