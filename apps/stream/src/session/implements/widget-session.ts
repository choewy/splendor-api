import { SessionStatus } from '../constants';

export class WidgetSession {
  static createKey(studioId: number) {
    return ['studio', studioId, 'widgets'].join(':');
  }

  readonly name: string;
  hash = '';
  status = SessionStatus.Wating;

  constructor(name: string) {
    this.name = name;
  }

  setHash(hash: string) {
    this.hash = hash;
    return this;
  }

  setStatus(status: SessionStatus) {
    this.status = status;
    return this;
  }
}
