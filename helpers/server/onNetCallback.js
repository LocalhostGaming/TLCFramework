const callbacks = {};

// This will listen from client emitted event
RegisterNetEvent('_internal_:fromClientEventCallback');
onNet('_internal_:fromClientEventCallback', async (eventName, ...params) => {
  try {
    const playerSource = global.source;

    if (callbacks[eventName]) {
      callbacks[eventName].forEach(async (callback) => {
        const response = await callback(...params);
        emitNet('_internal_:fromServerEventCallback', playerSource, eventName, response);
      });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error.message);
  }
});

const onNetCallback = async (eventName, callback) => {
  if (!(eventName in callbacks)) {
    callbacks[eventName] = [];
  }

  callbacks[eventName].push(callback);
};

export default onNetCallback;
