import Event from './Event';

import { proxy } from '../../helpers';
import { LostReferenceError, LostError } from '../error/index';

export default class Store {
  #event = new Event();
  #getters;
  #actions;

  constructor(object) {
    const {
      name, state, getters, actions,
    } = object || {};

    if (!name) throw new LostReferenceError('store name is required');

    this._name = name;

    Store.setState(this, state);

    if (getters) this.#getters = getters;

    if (actions) this.#actions = actions;
  }

  on(event, callback) {
    this.#event.on(event, callback);
  }

  get(key, data) {
    const getters = this.#getters;

    if (!(key in getters)) {
      throw new LostReferenceError(`Property '${key}' doesn't exists in store getters`);
    }

    return getters[key](this.state, data);
  }

  dispatch(key, data) {
    const actions = this.#actions;

    if (!(key in actions)) {
      throw new LostReferenceError(`Cannot dispatch action ${key} of undefined`);
    }

    const newState = actions[key](this.state, data);

    if (typeof newState !== 'object') {
      throw new LostError('Invalid state type. You must return state from store actions');
    }

    this.state = newState;
  }

  static setState(context, state = {}) {
    const self = context;
    const event = self.#event;

    const proxyState = proxy(state, {
      set: (target, key, value) => {
        event.emit('stateChange', target, key, value);

        target[key] = value;

        return true;
      },
    });

    self.state = proxyState;
  }
}
