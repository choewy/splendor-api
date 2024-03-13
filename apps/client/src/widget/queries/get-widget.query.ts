import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetWidgetQuery {
  @ApiProperty({ type: String })
  @IsString()
  id: string;
}
