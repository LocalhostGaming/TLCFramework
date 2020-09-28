import { LostTypeError } from '../error/index';

export default class Event {
  #events = Object;

  emit(event, ...params) {
    if (typeof event !== 'string') throw new LostTypeError('event name must be type of string');

    if (!(event in this.#events)) {
      return [];
    }

    return this.#events[event].map((callback) => callback(...params));
  }

  on(event, callback) {
    if (typeof event !== 'string') throw new LostTypeError('event name must be type of string');
    if (typeof callback !== 'function') throw new LostTypeError('event callback must be type of function');

    if (!(event in this.#events)) {
      this.#events[event] = [];
    }

    this.#events[event].push(callback);
  }
}
