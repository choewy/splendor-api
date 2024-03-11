export * from './user.entity';
export * from './user-follow-count.entity';
export * from './user-profile-image.entity';
export * from './oauth.entity';
export * from './studio.entity';
export * from './studio-setting.entity';
export * from './follow.entity';
export * from './forbidden-word.entity';
export * from './alert-sound.entity';
export * from './alert-widget.entity';
export * from './tts-voice.entity';
export * from './tts-voice-image.entity';
export * from './tts-voice-sample-sound.entity';
export * from './message-widget.entity';

import { AlertSoundEntity } from './alert-sound.entity';
import { AlertWidgetEntity } from './alert-widget.entity';
import { FollowEntity } from './follow.entity';
import { ForbiddenWordEntity } from './forbidden-word.entity';
import { MessageWidgetEntity } from './message-widget.entity';
import { OAuthEntity } from './oauth.entity';
import { StudioSettingEntity } from './studio-setting.entity';
import { StudioEntity } from './studio.entity';
import { TtsVoiceImageEntity } from './tts-voice-image.entity';
import { TtsVoiceSampleSoundEntity } from './tts-voice-sample-sound.entity';
import { TtsVoiceEntity } from './tts-voice.entity';
import { UserFollowCountEntity } from './user-follow-count.entity';
import { UserProfileImageEntity } from './user-profile-image.entity';
import { UserEntity } from './user.entity';

export const entities = [
  UserEntity,
  UserFollowCountEntity,
  UserProfileImageEntity,
  OAuthEntity,
  StudioEntity,
  StudioSettingEntity,
  FollowEntity,
  ForbiddenWordEntity,
  AlertSoundEntity,
  AlertWidgetEntity,
  TtsVoiceEntity,
  TtsVoiceImageEntity,
  TtsVoiceSampleSoundEntity,
  MessageWidgetEntity,
];
