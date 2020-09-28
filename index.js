import { Module, Store, Event } from './class/core/index';

import { proxy } from './helpers/index';
import { LostTypeError, LostDuplicateError } from './class/error/index';
import * as error from './class/error/index';

class Lost {
  static event = new Event();

  _modules = new Map();
  _stores = new Map();

  constructor(object = Object) {
    const { data } = object || {};

    if (data) {
      if (typeof data !== 'object') throw new LostTypeError(`'data' must be type of object`);
      Lost.setData(this, data);
    }
  }

  emit(event, ...params) {
    Lost.event.emit(event, ...params);
  }

  on(event, callback) {
    Lost.event.on(event, callback);
  }

  static setData(context, data) {
    const self = context;

    Object.entries(data).forEach(([key, value]) => {
      if (key in self) {
        throw new LostDuplicateError(`data '${key}' already exists in main`);
      }

      self[key] = value;
    });
  }

  store(object = Object) {
    const count = this._stores.size + 1;

    this._stores.set(`lost-store-${count}`, new Store(object));
  }

  module(object = Object) {
    const proxyModule = proxy(new Module(object, this, this._stores), {
      set: (target, key, value) => {
        const isModule = '_isModule' in target;

        if (isModule && key in target._data) {
          target._data[key] = value;
        }

        target[key] = value;

        return true;
      }
    });

    const count = this._modules.size + 1;
    const key = `lost-module-${count}`;

    this._modules.set(key, proxyModule);
    this._modules.get(key).initialize();
  }
}

export {
  proxy,
  error
};

export default Lost;
