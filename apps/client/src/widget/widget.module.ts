import { AlertWidgetRepository, StudioRepository } from '@libs/entity';
import { TypeOrmLibsModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';

import { WidgetController } from './widget.controller';
import { WidgetService } from './widget.service';

@Module({
  imports: [TypeOrmLibsModule.forFeature([StudioRepository, AlertWidgetRepository])],
  controllers: [WidgetController],
  providers: [WidgetService],
})
export class WidgetModule {}
