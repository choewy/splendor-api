import { ForbiddenWordRepository, StudioRepository } from '@libs/entity';
import { Injectable, NotFoundException } from '@nestjs/common';

import { ForbiddenWordsDto } from './dtos';
import { GetForbiddenWordsQuery } from './queries';

@Injectable()
export class ForbiddenWordsService {
  constructor(private readonly studioRepository: StudioRepository, private readonly forbiddenWordRepository: ForbiddenWordRepository) {}

  async getForbiddenWords(userId: number, query: GetForbiddenWordsQuery) {
    const studio = await this.studioRepository.findOne({
      select: { id: true },
      where: { user: { id: userId } },
    });

    if (studio === null) {
      throw new NotFoundException('not found studio');
    }

    const [rows, total] = await this.forbiddenWordRepository.findAndCount({
      where: { studio: { id: studio.id } },
      skip: query.skip,
      take: query.take,
    });

    return new ForbiddenWordsDto(rows, total);
  }
}
