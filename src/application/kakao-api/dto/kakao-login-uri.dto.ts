import { ApiResponseProperty } from '@nestjs/swagger';

export class KakaoLoginURIDTO {
  @ApiResponseProperty({ type: String })
  uri: string;

  constructor(uri: string) {
    this.uri = uri;
  }
}
