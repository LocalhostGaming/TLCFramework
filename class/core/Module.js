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
        if (this._name && options.logStartedModule) {
          console.log(`${'\x1b[36m'}[TLCFramework]${'\x1b[0m'} Started module '${this._name}'`);
        }
      }

      try {
        this.setup();
      } catch (error) {
        const moduleError = new Error(error.message);
        moduleError.name = `module-error / ${this._name}`
        throw moduleError;
      }
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
        if (!(key in context)) {
          throw new LostReferenceError(`property '${key}' is undefined`);
        }
        
        context[key] = value;

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
