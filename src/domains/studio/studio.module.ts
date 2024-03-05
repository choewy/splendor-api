import { TypeOrmExModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';

import { StudioController } from './studio.controller';
import { StudioRepository } from './studio.repository';

@Module({
  imports: [TypeOrmExModule.forFeature([StudioRepository])],
  controllers: [StudioController],
})
export class StudioModule {}
