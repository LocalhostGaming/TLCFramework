import Event from './Event';

import { proxy } from '../../helpers';
import { LostTypeError, LostDuplicateError, LostReferenceError } from '../error/index';

export default class Module {
  #event = new Event();

  constructor(object, main, store = new Map()) {
    const {
      name, data, methods, setup, stores, watch
    } = object || {};


    this.$root = main;
    this.$store = {};

    this._isModule = true;

    if(store.size > 0) {
      Module.setStore(this, store);
    }

    if (name) this._name = name;

    if (watch) this._watchers = watch;

    if (stores) Module.mapStore(this, stores);

    if (data) Module.setData(this, data);

    if (methods) Module.setMethods(this, methods);

    if (setup) this.setup = setup;
  }

  initialize() {
    if (this.setup) {

      if ('_options' in this.$root) {
        const options = this.$root._options;
        if (this._name && options.logStartedModule) console.log(`[TLCFramework] Started module '${this._name}'`);
      }

      this.setup();
    }
  }

  emit(event, ...params) {
    this.#event.emit(event, ...params);
  }

  on(event, callback) {
    this.#event.on(event, callback);
  }

  static setStore(context, stores) {
    stores.forEach((store) => {
      context.$store[store._name] = store;
    });
  }

  static mapStore(context, stores) {
    const self = context;

    if (stores.constructor.name !== 'Array') throw new LostTypeError('map store must be type of array');

    stores.forEach((storeName) => {
      if (!(storeName in self.$store)) {
        throw new LostReferenceError(`can't find '${storeName}' in registered store`);
      }

      self[`$${storeName}`] = self.$store[storeName];
    });
  }

  static setData(context, data) {
    const self = context;

    const proxyData = proxy(data, {
      set: (target, key, value) => {
        const watchers = self._watchers;
        const methods = self._methods;

        if (watchers && key in watchers) {
          const oldValue = target[key];

          if (typeof watchers[key] === 'string') {
            if (watchers[key] in methods) {
              const methodKey = watchers[key];
              self[methodKey](value, oldValue);
            } else {
              throw new LostReferenceError(`can't find '${watchers[key]}' in methods`);
            }
          } else {
            watchers[key](value, oldValue);
          }
        }

        target[key] = value;

        return true;
      }
    });

    self._data = proxyData;

    Object.entries(data).forEach(([key, value]) => {
      if (key in self) {
        throw new LostDuplicateError(`data '${key}' already exists in module`);
      }

      self[key] = value;
    });
  }

  static setMethods(context, methods) {
    const self = context;

    Object.entries(methods).forEach(([key, value]) => {
      if (key in self) {
        throw new LostDuplicateError(`method '${key}' already exists in module`);
      }

      if (typeof value !== 'function') {
        throw new LostTypeError(`'${key}' must be type of function`);
      }

      self[key] = value;
    });

    self._methods = methods;
  }
}
