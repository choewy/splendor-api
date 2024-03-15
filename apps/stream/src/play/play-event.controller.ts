import { OnLibsEvent } from '@libs/event';
import { Injectable } from '@nestjs/common';

import { ClearPlayEvent, PlayEvent } from './events';
import { PlayService } from './play.service';

@Injectable()
export class PlayEventController {
  constructor(private readonly playService: PlayService) {}

  @OnLibsEvent(ClearPlayEvent)
  onClear(event: ClearPlayEvent) {
    return this.playService.clear(event.studioId);
  }

  @OnLibsEvent(PlayEvent)
  onPlay(event: PlayEvent) {
    return this.playService.play(event.studioId, event.nextPointer);
  }
}
