import Event from './event';

import { reactive } from './helpers';

export default class Store {
  #event;

  #mode;

  #state;

  #getters;

  #actions;

  constructor(mode, object) {
    const {
      id, state, getters, actions,
    } = object || {};

    this.id = id;

    this.#mode = mode;

    this.#event = new Event();

    if (state) {
      this.#state = state;
      this.state = Store.proxyState(this, state);
    }

    if (getters) this.#getters = getters;

    if (actions) this.#actions = actions;
  }

  on(event, callback) {
    this.#event.on(event, callback);
  }

  getters(key, data) {
    const getters = this.#getters;

    if (!(key in getters)) {
      throw new Error(`Property '${key}' doesn't exists in getters`);
    }

    return getters[key](this.#state, data);
  }

  dispatch(key, data) {
    let { state } = this;
    const actions = this.#actions;

    if (!(key in actions)) {
      throw new Error(`Cannot dispatch action ${key} of undefined`);
    }

    const newState = actions[key](state, data);

    if (typeof newState !== 'object') {
      throw new Error('Invalid state type. You must return state from store actions');
    }

    state = Object.assign(state, newState);
  }

  static proxyState(context, state = {}) {
    const event = context.#event;

    const reactiveState = reactive(state, {
      set: (target, key, value) => {
        event.emit('stateChange', target, key, value);
      },
    });

    return reactiveState;
  }
}
