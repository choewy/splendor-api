import { AlertWidgetEntity } from '@entities/alert-widget.entity';
import { ApiResponseProperty } from '@nestjs/swagger';

export class StudioAlertWidgetDto {
  @ApiResponseProperty({ type: String })
  id: string;

  constructor(alertWidget: AlertWidgetEntity) {
    this.id = alertWidget.id;
  }
}
