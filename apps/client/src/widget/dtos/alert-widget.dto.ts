import { AlertWidgetEntity } from '@libs/entity';
import { ApiResponseProperty } from '@nestjs/swagger';

export class AlertWidgetDto {
  @ApiResponseProperty({ type: String })
  id: string;

  @ApiResponseProperty({ type: Number })
  studioId: number;

  constructor(alertWidget: AlertWidgetEntity) {
    this.id = alertWidget.id;
    this.studioId = alertWidget.studio.id;
  }
}
