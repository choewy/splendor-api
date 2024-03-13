import { AlertWidgetRepository, StudioRepository } from '@libs/entity';
import { Injectable, NotFoundException } from '@nestjs/common';

import { AlertWidgetDto, WidgetsDto } from './dtos';

@Injectable()
export class WidgetService {
  constructor(private readonly studioRepository: StudioRepository, private readonly alertWidgetRepository: AlertWidgetRepository) {}

  async getWidgets(userId: number) {
    const studio = await this.studioRepository.findOne({
      relations: { alertWidget: true },
      select: {
        id: true,
        alertWidget: { id: true },
      },
      where: { user: { id: userId } },
    });

    if (studio === null) {
      throw new NotFoundException('not found studio');
    }

    return new WidgetsDto(studio.alertWidget);
  }

  async getAlertWidget(id: string) {
    const alertWidget = await this.alertWidgetRepository.findOne({
      relations: { studio: true },
      select: { id: true, studio: { id: true } },
      where: { id },
    });

    if (alertWidget === null) {
      throw new NotFoundException('not foudn alert widget');
    }

    return new AlertWidgetDto(alertWidget);
  }
}
