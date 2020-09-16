import Event from './event';
import Store from './store';
import Module from './module';

import { reactive } from './helpers';

export default class Lost {
  #mode;

  #event;

  #storeEvent;

  #stores = {};

  #modules = [];

  constructor(object) {
    const { mode, data } = object || {};

    if (mode) {
      this.#mode = mode;
    } else {
      this.#mode = 'production';
    }

    const isDevelopment = this.#mode !== 'production';

    if (isDevelopment) {
      this._modules = [];
      this._store = {};
    }

    this.#event = new Event();

    this.#storeEvent = new Event();

    if (data) Lost.setData(this, data);

    on('onResourceStart', (resourceName) => {
      // check if resource name is TLCRP
      if (GetCurrentResourceName() !== resourceName) {
        return;
      }
      this.#event.emit('lost:onResourceStart');
    });

    on('onResourceStop', (resourceName) => {
      // check if resource name is TLCRP
      if (GetCurrentResourceName() !== resourceName) {
        return;
      }
      this.#event.emit('lost:onResourceStop');
    });
  }

  get mode() {
    return this.#mode;
  }

  module(object) {
    const isDevelopment = this.#mode !== 'production';

    const modules = isDevelopment ? this._modules : this.#modules;

    const stores = isDevelopment ? this._store : this.#stores;

    const root = {
      root: this,
      stores,
      event: this.#storeEvent,
    };

    const uid = modules.length + 1;

    modules.push(new Module(uid, object, root));
  }

  store(object) {
    const isDevelopment = this.#mode !== 'production';

    const stores = isDevelopment ? this._store : this.#stores;
    const key = object.id;

    if (key in stores) {
      throw new Error(`Store with id of ${key} is already exists.`);
    }

    stores[key] = new Store(this.#mode, object);

    return stores[key];
  }

  emit(event, data = {}) {
    this.#event.emit(event, data);
  }

  on(event, callback) {
    this.#event.on(event, callback);
  }

  static setData(context, object) {
    const data = reactive(object, {
      set: () => {
        context.#event.emit('_lost_internal_:setRootData');
      },
    });

    context.data = data;
  }
}
