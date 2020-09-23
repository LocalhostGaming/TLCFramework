const reactive = (object = Object, handler = Object) => {
  const {
    get, set, has, apply,
  } = handler || {};

  if (typeof object !== 'object') throw new Error('invalid object type');
  if (get && typeof get !== 'function') throw new Error('getter must be a function');
  if (set && typeof set !== 'function') throw new Error('setter must be a function');
  if (has && typeof has !== 'function') throw new Error('has must be a function');
  if (apply && typeof apply !== 'function') throw new Error('apply must be a function');

  const proxyHandler = {
    get: (target, key) => {
      const prop = target[key];

      if (typeof prop === 'undefined') { return undefined; }
      if (typeof prop === 'object') { target[key] = new Proxy(prop, proxyHandler); }

      if (get) return get(target, key);

      return target[key];
    },

    set: (target, key, value) => {
      if (set) return set(target, key, value);

      target[key] = value;

      return true;
    },

    has: (target, key) => {
      if (has) return has(target, key);
      return key in target;
    },

    apply: (target, thisArg, args) => {
      if (apply) return apply(target, thisArg, args);
      return target.apply(thisArg, args);
    },
  };

  return new Proxy(object, proxyHandler);
};

export {
  // eslint-disable-next-line import/prefer-default-export
  reactive,
};
