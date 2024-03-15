import { ApiProperty } from '@nestjs/swagger';

export class WidgetPlayCompleteCommand {
  @ApiProperty({ type: Number })
  id: number;
}
