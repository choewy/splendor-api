import { TtsVoiceEntity } from '@entities/tts-voice.entity';
import { ApiResponseProperty } from '@nestjs/swagger';

export class StudioTtsVoiceDto {
  @ApiResponseProperty({ type: Number })
  id: number;

  @ApiResponseProperty({ type: String })
  alias: string;

  @ApiResponseProperty({ type: String })
  image: string | null;

  @ApiResponseProperty({ type: String })
  sampleSound: string | null;

  constructor(ttsVoice: TtsVoiceEntity) {
    this.id = ttsVoice.id;
    this.alias = ttsVoice.alias;
    this.image = ttsVoice.ttsVoiceImage?.key ?? null;
    this.sampleSound = ttsVoice.ttsVoiceSampleSound?.key ?? null;
  }
}
