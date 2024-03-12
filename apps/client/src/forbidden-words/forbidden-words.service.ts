import { ForbiddenWordRepository, StudioEntity, StudioRepository } from '@libs/entity';
import { Injectable, NotFoundException } from '@nestjs/common';

import { SetForbiddenWordCommand } from './commands';
import { ForbiddenWordDto, ForbiddenWordsDto } from './dtos';
import { GetForbiddenWordsQuery } from './queries';

@Injectable()
export class ForbiddenWordsService {
  constructor(private readonly studioRepository: StudioRepository, private readonly forbiddenWordRepository: ForbiddenWordRepository) {}

  async getStudio(userId: number): Promise<Pick<StudioEntity, 'id'>> {
    const studio = await this.studioRepository.findOne({
      select: { id: true },
      where: { user: { id: userId } },
    });

    if (studio === null) {
      throw new NotFoundException('not found studio');
    }

    return studio;
  }

  async getForbiddenWords(userId: number, query: GetForbiddenWordsQuery) {
    const studio = await this.getStudio(userId);

    const [rows, total] = await this.forbiddenWordRepository.findAndCount({
      where: { studio: { id: studio.id } },
      skip: query.skip,
      take: query.take,
    });

    return new ForbiddenWordsDto(rows, total);
  }

  async createForbiddenWord(userId: number, command: SetForbiddenWordCommand) {
    const studio = await this.getStudio(userId);
    const forbiddenWord = this.forbiddenWordRepository.create({
      word: command.word,
      status: command.status,
      studio,
    });

    return new ForbiddenWordDto(await forbiddenWord.save());
  }

  async updateForbiddenWord(userId: number, forbiddenWordId: number, command: SetForbiddenWordCommand) {
    const studio = await this.getStudio(userId);
    const existsForbiddenWord = await this.forbiddenWordRepository.existsBy({
      id: forbiddenWordId,
      studio,
    });

    if (existsForbiddenWord === false) {
      throw new NotFoundException('not found forbidden word');
    }

    await this.forbiddenWordRepository.update(forbiddenWordId, {
      word: command.word,
      status: command.status,
    });
  }

  async deleteForbiddenWord(userId: number, forbiddenWordId: number) {
    const studio = await this.getStudio(userId);
    const existsForbiddenWord = await this.forbiddenWordRepository.existsBy({
      id: forbiddenWordId,
      studio,
    });

    if (existsForbiddenWord === false) {
      throw new NotFoundException('not found forbidden word');
    }

    await this.forbiddenWordRepository.delete(forbiddenWordId);
  }
}
