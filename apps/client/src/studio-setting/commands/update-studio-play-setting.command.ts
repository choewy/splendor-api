import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDecimal, IsInt, IsOptional, Max, Min } from 'class-validator';

export class UpdateStudioPlaySettingCommand {
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  autoPlay?: boolean;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  alertVolume?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  messageVolume?: number;

  @ApiPropertyOptional({ type: Number, format: 'float' })
  @IsOptional()
  @IsDecimal()
  delay?: string;

  @ApiPropertyOptional({ type: Number, format: 'float' })
  @IsOptional()
  @IsDecimal()
  maxSeconds?: string;
}
