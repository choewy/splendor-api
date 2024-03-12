import {
  StudioDonationSettingRepository,
  StudioPlaySettingRepository,
  StudioRepository,
  StudioStreamSettingRepository,
} from '@libs/entity';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Not } from 'typeorm';

import { UpdateStudioCommand } from './commands';
import { StudioDto } from './dtos';

@Injectable()
export class StudioService {
  constructor(
    private readonly studioRepository: StudioRepository,
    private readonly studioPlaySettingRepository: StudioPlaySettingRepository,
    private readonly studioDonationSettingRepository: StudioDonationSettingRepository,
    private readonly studioStreamSettingRepository: StudioStreamSettingRepository,
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

  async getStudio(userId: number) {
    const studio = await this.studioRepository.findOne({
      relations: {
        studioDonationSetting: true,
        studioPlaySetting: true,
        studioStreamSettings: true,
      },
      where: { user: { id: userId } },
    });

    if (studio === null) {
      throw new NotFoundException('not found studio');
    }

    return new StudioDto(studio);
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
