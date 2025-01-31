import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInstance, IsOptional } from 'class-validator';

import { TakeTokenTargetDTO } from './take-token-target.dto';

export class TakeTokenDTO {
  @ApiPropertyOptional({ type: TakeTokenTargetDTO, description: '루비' })
  @IsInstance(TakeTokenTargetDTO)
  @IsOptional()
  ruby?: TakeTokenTargetDTO;

  @ApiPropertyOptional({ type: TakeTokenTargetDTO, description: '사파이어' })
  @IsInstance(TakeTokenTargetDTO)
  @IsOptional()
  sapphire?: TakeTokenTargetDTO;

  @ApiPropertyOptional({ type: TakeTokenTargetDTO, description: '에메랄드' })
  @IsInstance(TakeTokenTargetDTO)
  @IsOptional()
  emerald?: TakeTokenTargetDTO;

  @ApiPropertyOptional({ type: TakeTokenTargetDTO, description: '오닉스' })
  @IsInstance(TakeTokenTargetDTO)
  @IsOptional()
  onyx?: TakeTokenTargetDTO;

  @ApiPropertyOptional({ type: TakeTokenTargetDTO, description: '다이아몬드' })
  @IsInstance(TakeTokenTargetDTO)
  @IsOptional()
  diamond?: TakeTokenTargetDTO;
}
