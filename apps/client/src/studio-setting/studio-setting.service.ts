import { KafkaTopics, KafkaStudioPlaySettingMessage } from '@libs/common';
import { StudioDonationSettingRepository, StudioPlaySettingRepository, StudioRepository } from '@libs/entity';
import { KafkaProducer, KafkaSendMessageCommand } from '@libs/kafka';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import Decimal from 'decimal.js';

import { UpdateStudioDonationSettingCommand, UpdateStudioPlaySettingCommand } from './commands';

@Injectable()
export class StudioSettingService {
  constructor(
    private readonly kafkaProducer: KafkaProducer,
    private readonly sutdioRepository: StudioRepository,
    private readonly sutdioPlaySettingRepository: StudioPlaySettingRepository,
    private readonly studioDonationSettingRepository: StudioDonationSettingRepository,
  ) {}

  async getStudio(userId: number) {
    const studio = await this.sutdioRepository.findOne({
      where: { user: { id: userId } },
    });

    if (studio === null) {
      throw new NotFoundException('not found studio');
    }

    return studio;
  }

  async updateStudioPlaySetting(userId: number, command: UpdateStudioPlaySettingCommand) {
    const studio = await this.getStudio(userId);
    const studioPlaySetting = await this.sutdioPlaySettingRepository.findOneBy({ studioId: studio.id });

    if (typeof command.autoPlay === 'boolean') {
      studioPlaySetting.autoPlay = command.autoPlay;
    }

    if (typeof command.alertVolume === 'number') {
      studioPlaySetting.alertVolume = command.alertVolume;
    }

    if (typeof command.messageVolume === 'number') {
      studioPlaySetting.messageVolume = command.messageVolume;
    }

    if (Decimal.isDecimal(command.delay)) {
      const delay = new Decimal(command.delay);

      if (delay.lessThanOrEqualTo(new Decimal(0))) {
        throw new BadRequestException('');
      }

      if (delay.greaterThan(new Decimal(10))) {
        throw new BadRequestException('');
      }

      studioPlaySetting.delay = delay.toFixed(1);
    }

    if (Decimal.isDecimal(command.maxSeconds)) {
      const maxSeconds = new Decimal(command.maxSeconds);

      if (maxSeconds.lessThanOrEqualTo(new Decimal(0))) {
        throw new BadRequestException('');
      }

      if (maxSeconds.greaterThan(new Decimal(15))) {
        throw new BadRequestException('');
      }

      studioPlaySetting.maxSeconds = maxSeconds.toFixed(1);
    }

    await this.sutdioPlaySettingRepository.update({ studio }, studioPlaySetting);

    const kafkaMessages = [new KafkaStudioPlaySettingMessage(studioPlaySetting)];
    const kafkaSendMessageCommand = new KafkaSendMessageCommand(KafkaTopics.Studio, kafkaMessages);
    await this.kafkaProducer.send(kafkaSendMessageCommand);
  }

  async updateStudioDonationSetting(userId: number, command: UpdateStudioDonationSettingCommand) {
    const studio = await this.getStudio(userId);

    await this.studioDonationSettingRepository.update({ studio }, {});
  }
}
