import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileCommand {
  @ApiProperty({ type: String })
  nickname: string;
}
