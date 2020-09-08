import Event from './event';
import Store from './store';
import Module from './module';

export default class Lost {
  #mode;

  #event;

  #storeEvent;

  #stores = {};

  #modules = [];

  constructor(object) {
    const { mode, data } = object;

    if (mode) this.#mode = mode || process.env.NODE_ENV || 'production';

    const isDevelopment = this.#mode !== 'production';

    if (isDevelopment) {
      this._modules = [];
      this._store = {};
    }

    this.#event = new Event();

    this.#storeEvent = new Event();

    if (data) Lost.setData(this, data);
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
  }

  emit(event, data = {}) {
    this.#event.emit(event, data);
  }

  on(event, callback) {
    this.#event.on(event, callback);
  }

  static setData(context, object) {
    const handler = {
      set: (target, key, value) => {
        target[key] = value;
        context.#event.emit('updateRootData');
      },
      get: (target, key) => {
        if (key === 'isProxy') { return true; }

        const prop = target[key];

        // return if property not found
        // eslint-disable-next-line consistent-return
        if (typeof prop === 'undefined') { return; }

        // set value as proxy if object
        if (!prop.isProxy && typeof prop === 'object') { target[key] = new Proxy(prop, handler); }

        return target[key];
      },
    };

    context.data = new Proxy((object || {}), handler);
  }
}
