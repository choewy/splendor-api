import { MessageWidgetEntity } from '@entities/message-widget.entity';
import { ApiResponseProperty } from '@nestjs/swagger';

export class StudioMessageWidgetDto {
  @ApiResponseProperty({ type: String })
  id: string;

  constructor(messageWidget: MessageWidgetEntity) {
    this.id = messageWidget.id;
  }
}
