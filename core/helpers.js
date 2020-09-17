const reactive = (object, handler) => {
  const { get, set } = handler || {};

  if (typeof object !== 'object') throw new Error('invalid object type');
  if (get && typeof get !== 'function') throw new Error('getter must be a function');
  if (set && typeof set !== 'function') throw new Error('setter must be a function');

  const proxyHandler = {
    get: (target, key) => {
      if (key === 'isProxy') { return true; }
      const prop = target[key];
      if (typeof prop === 'undefined') { return undefined; }
      if (!prop.isProxy && typeof prop === 'object') { target[key] = new Proxy(prop, proxyHandler); }

      if (get) get(target, key);
      return target[key];
    },
    set: (target, key, value) => {
      if (set) set(target, key, value);
      target[key] = value;
      return true;
    },
  };

  return new Proxy(object, proxyHandler);
};

export {
  // eslint-disable-next-line import/prefer-default-export
  reactive,
};
