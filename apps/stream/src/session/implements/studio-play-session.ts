import { SessionStatus } from '../constants';

export class StudioPlaySession {
  key = '';
  pointer = -1;
  status = SessionStatus.Wating;

  static createKey(studioId: number) {
    return ['studio', studioId, 'play'].join(':');
  }
}
