import { StudioEntity } from '@entities/studio.entity';
import { AbstractRepository, InjectableRepository } from '@libs/typeorm';

@InjectableRepository(StudioEntity)
export class StudioRepository extends AbstractRepository<StudioEntity> {
  async createDefault(userId: number): Promise<StudioEntity> {
    const studio = this.create({
      user: { id: userId },
      studioSetting: {},
      alertWidget: {},
      messageWidget: {},
    });

    return studio.save();
  }

  async findByUserId(userId: number) {
    return this.findOne({
      relations: {
        studioSetting: true,
        messageWidget: true,
        alertWidget: true,
        alertSound: true,
        ttsVoice: { ttsVoiceImage: true, ttsVoiceSampleSound: true },
        forbiddenWords: true,
      },
      where: { user: { id: userId } },
    });
  }
}
