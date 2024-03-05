import { Injectable } from '@nestjs/common';

import { StudioRepository } from '../studio.repository';

@Injectable()
export class StudioService {
  constructor(private readonly studioRepository: StudioRepository) {}

  async initializeMyStudio(userId: number) {
    const has = await this.studioRepository.existsBy({ user: { id: userId } });

    if (has === false) {
      await this.studioRepository.createDefault(userId);
    }
  }
}
