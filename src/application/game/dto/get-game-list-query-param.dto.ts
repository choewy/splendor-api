import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class GetGameListQueryParamDTO {
  @ApiPropertyOptional({ type: Number, description: '페이지 번호(Zero Based)' })
  @IsInt()
  @IsOptional()
  skip = 0;

  @ApiPropertyOptional({ type: Number, description: '목록수' })
  @IsInt()
  @IsOptional()
  take = 20;
}
