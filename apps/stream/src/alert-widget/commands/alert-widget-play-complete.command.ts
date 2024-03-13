import { ApiProperty } from '@nestjs/swagger';

export class AlertWidgetPlayCompleteCommand {
  @ApiProperty({ type: Number })
  id: number;
}
