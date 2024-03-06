import { StudioEntity } from '@entities/studio.entity';
import { AbstractRepository, InjectableRepository } from '@libs/typeorm';

@InjectableRepository(StudioEntity)
export class StudioRepository extends AbstractRepository<StudioEntity> {
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
