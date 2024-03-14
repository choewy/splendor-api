import { Injectable } from '@nestjs/common';

import { PlayService } from './play.service';

@Injectable()
export class PlayEventController {
  constructor(private readonly playService: PlayService) {}
  onCheckPlay() {
    return;
  }

  onDonationRegist() {
    return;
  }
}
