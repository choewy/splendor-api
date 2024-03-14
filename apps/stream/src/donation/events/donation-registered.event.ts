import { DonationSession } from '@apps/stream/session';

export class DonationRegisteredEvent {
  constructor(readonly studioId: number, readonly session: DonationSession) {}
}
