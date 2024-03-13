import { SessionStatus } from '../constants';

export class StudioWidgetSession {
  name: string;
  status = SessionStatus.Wating;

  constructor(name: string) {
    this.name = name;
  }

  static createKey(studioId: number) {
    return ['studio', studioId, 'widget'].join(':');
  }
}
