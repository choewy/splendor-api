import { Injectable } from '@nestjs/common';

import { DonationSessionManager, StudioPlaySessionManager, StudioSettingSessionManager } from '../session';

@Injectable()
export class PlayService {
  constructor(
    private readonly studioPlaySessionManager: StudioPlaySessionManager,
    private readonly studioSettingSessionManager: StudioSettingSessionManager,
    private readonly donationSessionManager: DonationSessionManager,
  ) {}

  async checkCanPlay(studioId: number) {
    const studioPlaySession = await this.studioPlaySessionManager.get(studioId);

    if (studioPlaySession) {
      return;
    }
  }
}
