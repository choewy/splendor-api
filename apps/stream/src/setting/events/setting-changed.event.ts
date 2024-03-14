import { StudioSettingSession } from '@apps/stream/session';

export class SettingChangedEvent {
  constructor(readonly studioId: number, readonly session: StudioSettingSession) {}
}
