import Event from './event';
import Store from './store';
import Module from './module';

export default class Lost {
  #mode;

  #event;

  #storeEvent;

  #stores = {};

  #modules = [];

  constructor(object = Object) {
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

  modules(array) {
    if (array.constructor.name !== 'Array') {
      throw new TypeError('Invalid parameter passed in \'modules\'');
    }

    const isDevelopment = this.#mode !== 'production';

    const modules = isDevelopment ? this._modules : this.#modules;

    const stores = isDevelopment ? this._store : this.#stores;

    const root = {
      root: this,
      stores,
      event: this.#storeEvent,
    };

    const uid = modules.length + 1;

    array.forEach((module) => {
      modules.push(new Module(uid, module, root));
    });
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
    Object.entries(object).forEach(([key, value]) => {
      if (key in context) {
        throw new Error(`Property ${key} already exists`);
      }

      context[key] = value;
    });
  }
}
