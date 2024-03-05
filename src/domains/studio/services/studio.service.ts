import { Injectable } from '@nestjs/common';

import { StudioDto } from '../dtos';
import { StudioRepository } from '../studio.repository';

@Injectable()
export class StudioService {
  constructor(private readonly studioRepository: StudioRepository) {}

  async getMyStudio(userId: number) {
    const has = await this.studioRepository.existsBy({ user: { id: userId } });

    if (has === false) {
      await this.studioRepository.createDefault(userId);
    }

    const studio = await this.studioRepository.findByUserId(userId);

    return new StudioDto(studio);
  }
}
