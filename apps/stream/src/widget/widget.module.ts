import { AlertWidgetRepository, StudioPlaySettingRepository } from '@libs/entity';
import { TypeOrmLibsModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';

import { WidgetEventController } from './widget-event.controller';
import { WidgetGateway } from './widget.gateway';
import { WidgetService } from './widget.service';

@Module({
  imports: [TypeOrmLibsModule.forFeature([AlertWidgetRepository, StudioPlaySettingRepository])],
  providers: [WidgetEventController, WidgetGateway, WidgetService],
})
export class WidgetModule {}
