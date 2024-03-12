import { ForbiddenWordEntity } from '@libs/entity';
import { ApiResponseProperty } from '@nestjs/swagger';

export class ForbiddenWordDto {
  @ApiResponseProperty({ type: Number })
  id: number;

  @ApiResponseProperty({ type: String })
  word: string;

  @ApiResponseProperty({ type: Boolean })
  status: boolean;

  @ApiResponseProperty({ type: Date })
  createdAt: Date;

  @ApiResponseProperty({ type: Date })
  updatedAt: Date;

  constructor(forbiddenWord: ForbiddenWordEntity) {
    this.id = forbiddenWord.id;
    this.word = forbiddenWord.word;
    this.status = forbiddenWord.status;
    this.createdAt = forbiddenWord.createdAt;
    this.updatedAt = forbiddenWord.updatedAt;
  }
}
