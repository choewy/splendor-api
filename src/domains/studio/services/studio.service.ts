import { Injectable } from '@nestjs/common';

import { StudioDto } from '../dtos';
import { StudioRepository } from '../repositories';

@Injectable()
export class StudioService {
  constructor(private readonly studioRepository: StudioRepository) {}

  async getMyStudio(userId: number) {
    const studio = await this.studioRepository.findByUserId(userId);

    return new StudioDto(studio);
  }
}
