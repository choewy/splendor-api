import { AlertWidgetEntity } from '@libs/entity';
import { ApiResponseProperty } from '@nestjs/swagger';

export class WidgetsDto {
  @ApiResponseProperty({ type: String })
  alert: string;

  constructor(alertWidget: AlertWidgetEntity) {
    this.alert = alertWidget.id;
  }
}
