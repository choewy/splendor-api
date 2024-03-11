import { ForbiddenWordRepository, StudioRepository, StudioStreamSettingRepository } from '@libs/entity';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Not } from 'typeorm';

import { UpdateStudioCommand } from './commands';
import { StudioDto } from './dtos';

@Injectable()
export class StudioService {
  constructor(
    private readonly studioRepository: StudioRepository,
    private readonly studioStreamSettingRepository: StudioStreamSettingRepository,
    private readonly forbiddenWordRepository: ForbiddenWordRepository,
  ) {}

  async validateExistsStudio(userId: number) {
    const studio = await this.studioRepository.findOne({
      where: { user: { id: userId } },
    });

    if (studio === null) {
      throw new NotFoundException('not found studio');
    }

    return studio;
  }

  async getStudioStreamSettingAndForbiddenWordsCount(studioId: number) {
    const [streamSettingCount, forbiddenWordsCount] = await Promise.all([
      this.studioStreamSettingRepository.countBy({ studio: { id: studioId } }),
      this.forbiddenWordRepository.countBy({ studio: { id: studioId } }),
    ]);

    return [streamSettingCount, forbiddenWordsCount];
  }

  async getStudio(userId: number) {
    const studio = await this.validateExistsStudio(userId);
    const [streamSettingCount, forbiddenWordsCount] = await this.getStudioStreamSettingAndForbiddenWordsCount(studio.id);

    return new StudioDto(studio, streamSettingCount, forbiddenWordsCount);
  }

  async updateStudio(userId: number, command: UpdateStudioCommand) {
    const studio = await this.validateExistsStudio(userId);

    if (typeof command.alias === 'string' && studio.alias !== command.alias) {
      const existsAlias = await this.studioRepository.exists({
        select: { id: true, alias: true },
        where: { id: Not(studio.id), alias: command.alias },
      });

      if (existsAlias === true) {
        throw new ConflictException('already exists studio alias');
      }

      studio.alias = command.alias;
    }

    if (typeof command.introduction === 'string' && studio.introduction !== command.introduction) {
      studio.introduction = command.introduction;
    }

    await this.studioRepository.update(studio.id, studio);
  }
}
