import { AlertSoundEntity } from '@entities/alert-sound.entity';
import { ApiResponseProperty } from '@nestjs/swagger';

export class StudioAlertSoundDto {
  @ApiResponseProperty({ type: Number })
  id: number;

  @ApiResponseProperty({ type: String })
  key: string;

  @ApiResponseProperty({ type: String })
  alias: string;

  constructor(alertSound: AlertSoundEntity) {
    this.id = alertSound.id;
    this.key = alertSound.key;
    this.alias = alertSound.alias;
  }
}
