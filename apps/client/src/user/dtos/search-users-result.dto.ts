import { UserEntity } from '@libs/entity';
import { ApiResponseProperty } from '@nestjs/swagger';

import { SearchedUserDto } from './searched-user.dto';

export class SearchUsersResultDto {
  @ApiResponseProperty({ type: Number })
  total: number;

  @ApiResponseProperty({ type: [SearchedUserDto] })
  rows: SearchedUserDto[];

  constructor(rows: UserEntity[], total: number) {
    this.total = total;
    this.rows = rows.map((row) => new SearchedUserDto(row));
  }
}
