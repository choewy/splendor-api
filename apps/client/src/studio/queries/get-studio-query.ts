import { ApiProperty } from '@nestjs/swagger';

export class GetStudioQuery {
  @ApiProperty({ type: Number })
  userId: number;
}
