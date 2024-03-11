import { ForbiddenWordEntity } from '@libs/entity';
import { ApiResponseProperty } from '@nestjs/swagger';

import { ForbiddenWordDto } from './forbidden-word.dto';

export class ForbiddenWordsDto {
  @ApiResponseProperty({ type: Number })
  total: number;

  @ApiResponseProperty({ type: [ForbiddenWordDto] })
  rows: ForbiddenWordDto[];

  constructor(rows: ForbiddenWordEntity[], total: number) {
    this.total = total;
    this.rows = rows.map((row) => new ForbiddenWordDto(row));
  }
}
