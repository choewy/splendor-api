import { Type } from '@nestjs/common';
import { ApiResponseProperty } from '@nestjs/swagger';

export const PaginationType = <R>(Row: Type<R>) => {
  abstract class PaginationDto {
    @ApiResponseProperty({ type: Number })
    total: number;

    @ApiResponseProperty({ type: [Row] })
    rows: R[];

    constructor(rows: R[], total: number) {
      this.total = total;
      this.rows = rows;
    }
  }

  return PaginationDto;
};
