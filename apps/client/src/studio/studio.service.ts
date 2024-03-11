import { ForbiddenWordRepository, StudioRepository, StudioStreamSettingRepository } from '@libs/entity';
import { Injectable, NotFoundException } from '@nestjs/common';

import { StudioDto } from './dtos';

@Injectable()
export class StudioService {
  constructor(
    private readonly studioRepository: StudioRepository,
    private readonly studioStreamSettingRepository: StudioStreamSettingRepository,
    private readonly forbiddenWordRepository: ForbiddenWordRepository,
  ) {}

  async getStudio(userId: number) {
    const studio = await this.studioRepository.findOne({
      where: { user: { id: userId } },
    });

    if (studio === null) {
      throw new NotFoundException('not found studio');
    }

    const streamSettingCount = await this.studioStreamSettingRepository.countBy({
      studio: { id: studio.id },
    });

    const forbiddenWordsCount = await this.forbiddenWordRepository.countBy({
      studio: { id: studio.id },
    });

    return new StudioDto(studio, streamSettingCount, forbiddenWordsCount);
  }
}
