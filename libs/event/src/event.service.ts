import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { OnEventLibsReturnType } from './decorators';

@Injectable()
export class EventService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async waitFor<ReturnType = any, EventType = any>(event: EventType, opts?: { ignoreError?: boolean }) {
    const prototype = Object.getPrototypeOf(event);
    const prototypeName = prototype.constructor.name;

    const returnValues = await this.eventEmitter.emitAsync(prototypeName, event);
    const returnValue = returnValues.shift() as OnEventLibsReturnType<ReturnType>;

    if (returnValue.error) {
      if (opts?.ignoreError === true) {
        return null;
      }

      throw returnValue.error;
    }

    return returnValue.value;
  }

  send<EventType = any>(event: EventType) {
    const prototype = Object.getPrototypeOf(event);
    const prototypeName = prototype.constructor.name;

    this.eventEmitter.emit(prototypeName, event);
  }
}
