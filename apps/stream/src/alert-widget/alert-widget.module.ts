import { AlertWidgetRepository } from '@libs/entity';
import { TypeOrmLibsModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';

import { AlertWidgetGateway } from './alert-widget.gateway';
import { AlertWidgetService } from './alert-widget.service';

@Module({
  imports: [TypeOrmLibsModule.forFeature([AlertWidgetRepository])],
  providers: [AlertWidgetGateway, AlertWidgetService],
  exports: [AlertWidgetGateway],
})
export class AlertWidgetModule {}
