import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class CreateDonationCommand {
  @ApiProperty({ type: Number })
  @IsInt()
  @Min(1)
  recipientId: number;

  @ApiProperty({ type: Number })
  @IsInt()
  @Min(1)
  amount: number;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  nickname?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @Length(0, 128)
  message?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @Length(0, 1024)
  imageUrl?: string;
}
