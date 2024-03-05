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

    await this.save(studio);

    return studio;
  }
}
