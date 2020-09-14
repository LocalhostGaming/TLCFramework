export default class Module {
  #mode;

  #event;

  #children = [];

  #stores = {};

  #boot;

  constructor(uid, object, rootObject, parent) {
    const {
      name, modules, data, methods, boot, mapStore,
    } = object || {};
    const { stores, root, event } = rootObject || {};

    this.$root = root;
    this.$store = {};
    this.#mode = root.mode;
    this._isBooted = false;
    this.#event = event;
    this._options = {
      name,
    };
    this._uid = uid;

    if (parent) this.$parent = parent;

    if (stores) Module.setStore(this, stores, mapStore);

    if (data) Module.setData(this, data);

    if (methods) Module.setMethods(this, methods);

    if (modules) Module.setModules(this, modules);

    if (boot) {
      this.#boot = boot;
      this.boot();
    }
  }

  boot() {
    const children = this.#children;

    if (!this.$parent) {
      // Will boot if main parent
      this.#boot();
      this._isBooted = true;
    } else if (this.$parent._isBooted) {
      // Will boot if parent is booted
      this.#boot();
      this._isBooted = true;
    }

    // Boot Children
    if (this._hasChildren) {
      children.forEach((child) => {
        child.boot();
      });
    }
  }

  emit(event, data = {}) {
    this.#event.emit(event, data);
  }

  on(event, callback) {
    this.#event.on(event, callback);
  }

  static setStore(context, stores, mapStore) {
    Object.entries(stores).forEach(([key, value]) => {
      if (key in context) {
        throw new Error(`Store ${key} already exists`);
      }

      Object.seal(value);
      context.#stores[key] = value;
      context.$store[key] = context.#stores[key];

      if (mapStore && mapStore.includes(key)) {
        context[`$${key}`] = context.#stores[key];
      }
    });
  }

  static setData(context, data) {
    Object.entries(data).forEach(([key, value]) => {
      if (key in context) {
        throw new Error(`Property ${key} already exists`);
      }

      context[key] = value;
    });
  }

  static setMethods(context, methods) {
    Object.entries(methods).forEach(([key, value]) => {
      if (key in context) {
        throw new Error(`Methods ${key} already exists`);
      }

      if (value.constructor.name !== 'Function') {
        throw new TypeError(`Method '${key}' must be a function`);
      }

      context[key] = value;
    });
  }

  static setModules(context, modules) {
    context._hasChildren = true;

    Object.entries(modules).forEach(([key, value]) => {
      if (typeof modules[key] !== 'object') {
        throw new TypeError('Invalid child module type');
      }

      const root = {
        stores: context.#stores,
        root: context.$root,
      };

      const uid = context.#children.length + 1;

      const parent = context;

      const module = new Module(uid, value, root, parent);

      if (key in context) {
        throw new Error(`Property module ${key} is already exists`);
      }

      context[key] = {
        on(event, callback) { module.on(event, callback); },
        emit(event, data = {}) { module.emit(event, data); },
      };

      context.#children.push(module);
    });
  }
}
