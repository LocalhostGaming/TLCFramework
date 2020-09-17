export default class Event {
  #events = {};

  emit(event, ...params) {
    if (!(event in this.#events)) {
      return [];
    }

    return this.#events[event].map((callback) => callback(...params));
  }

  on(event, callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('Invalid callback type');
    }

    if (!(event in this.#events)) {
      this.#events[event] = [];
    }

    this.#events[event].push(callback);
  }
}
