import { ApiResponseProperty } from '@nestjs/swagger';

export class CreateOAuthUrlDto {
  @ApiResponseProperty({ type: String })
  url: string;
}
