import { StudioEntity } from '@entities/studio.entity';
import { ApiResponseProperty } from '@nestjs/swagger';

import { StudioAlertSoundDto } from './studio-alert-sound.dto';
import { StudioSettingDto } from './studio-setting.dto';
import { StudioTtsVoiceDto } from './studio-tts-voice.dto';

export class StudioDto {
  @ApiResponseProperty({ type: Number })
  id: number;

  @ApiResponseProperty({ type: StudioSettingDto })
  studioSetting: StudioSettingDto;

  @ApiResponseProperty({ type: StudioAlertSoundDto })
  alertSound: StudioAlertSoundDto | null;

  @ApiResponseProperty({ type: StudioTtsVoiceDto })
  ttsVoice: StudioTtsVoiceDto | null;

  constructor(studio: StudioEntity) {
    this.id = studio.id;
    this.studioSetting = new StudioSettingDto(studio.studioSetting);
    this.alertSound = studio.alertSound ? new StudioAlertSoundDto(studio.alertSound) : null;
    this.ttsVoice = studio.ttsVoice ? new StudioTtsVoiceDto(studio.ttsVoice) : null;
  }
}
