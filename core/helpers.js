const reactive = (object, handler) => {
  const { get, set } = handler || {};

  if (typeof object !== 'object') throw new Error('invalid object type');
  if (get && typeof get !== 'function') throw new Error('getter must be a function');
  if (set && typeof set !== 'function') throw new Error('setter must be a function');

  const proxyHandler = {
    get: (target, key, receiver) => {
      if (get) get(target, key, receiver);
      const v = key in target ? target[key] : (target[key] = {});
      return typeof v === 'object' ? new Proxy(v, proxyHandler) : v;
    },
    set: (target, key, value) => {
      if (set) set(target, key, value);
      target[key] = value;
      return true;
    },
    has: (oTarget, sKey) => sKey in oTarget || oTarget.hasItem(sKey),
  };

  return new Proxy(object, proxyHandler);
};

export {
  // eslint-disable-next-line import/prefer-default-export
  reactive,
};
